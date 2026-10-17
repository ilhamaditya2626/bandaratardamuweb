"use client";

import { useRef, useState } from "react";
import { Plus, Edit2, Trash2, X, ImagePlus } from "lucide-react";

import { useGetNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/useNews";

// Format excerpt deskripsi dari konten berita secara profesional (beberapa kalimat ringkas tanpa tag HTML)
function formatNewsDescription(content: string, maxSentences: number = 2, maxChars: number = 160): string {
  if (!content) return "Tidak ada deskripsi";

  // Bersihkan tag HTML dan entitas umum
  const plain = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "Tidak ada deskripsi";
  if (plain.length <= maxChars) return plain;

  // Coba potong berdasarkan akhir kalimat (titik) agar kalimat utuh dan enak dibaca
  const sentenceMatches = plain.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (sentenceMatches && sentenceMatches.length > 0) {
    let combined = "";
    for (let i = 0; i < Math.min(sentenceMatches.length, maxSentences); i++) {
      const candidate = (combined + sentenceMatches[i]).trim();
      if (candidate.length <= maxChars) {
        combined = candidate + " ";
      } else {
        break;
      }
    }
    if (combined.trim().length >= 50) {
      return combined.trim();
    }
  }

  // Fallback pemotongan rapi per kata
  const sliced = plain.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim() + "...";
}

export default function NewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const page = 1;
  const limit = 50;

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [articleDate, setArticleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

  const { data: response, isLoading: isFetching } = useGetNews(page, limit);

  const news = response?.data || [];

  const createMutation = useCreateNews({
    onSuccess: () => {
      alert("Berita berhasil ditambahkan!");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      console.error("Gagal menambahkan berita:", err);
      alert(err?.message || "Gagal menambahkan berita.");
    },
  });

  const updateMutation = useUpdateNews({
    onSuccess: () => {
      alert("Berita berhasil diperbarui!");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      console.error("Gagal memperbarui berita:", err);
      alert(err?.message || "Gagal memperbarui berita.");
    },
  });

  const deleteMutation = useDeleteNews({
    onError: (err: any) => {
      console.error("Gagal menghapus berita:", err);
      alert(err?.message || "Gagal menghapus berita.");
    },
  });

  const openEditModal = (article: any) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content || "");
    setImageUrl(article.image_url || "");
    setImagePreview(article.image_url || "");
    setImageError(false);
    setImageFile(null);
    // Populate the date from the article's created_at
    const existingDate = article.created_at ? new Date(article.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    setArticleDate(existingDate);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setImagePreview("");
    setImageError(false);
    setImageFile(null);
    setArticleDate(new Date().toISOString().slice(0, 10));
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Kompresi gambar sisi klien agar tidak gagal terkena batas upload Nginx / server
  const compressImageIfNeeded = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.size <= 1.5 * 1024 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1600;
          let width = img.width;
          let height = img.height;

          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) return resolve(file);
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File yang dipilih harus berupa gambar.");
      return;
    }

    try {
      const processed = await compressImageIfNeeded(file);
      setImageFile(processed);
      setImagePreview(URL.createObjectURL(processed));
    } catch {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Judul berita harus diisi");
      return;
    }
    if (!content.trim()) {
      alert("Konten berita harus diisi");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("created_at", articleDate);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (imageUrl) {
      formData.append("image_url", imageUrl);
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus berita ini?")) return;
    deleteMutation.mutate(id);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Manajemen Berita
        </h2>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Berita
        </button>
      </div>

      {/* Data Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg bg-white">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-[30%] px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Judul
                    </th>
                    <th scope="col" className="w-[45%] px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th scope="col" className="w-[15%] px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="w-[10%] relative px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isFetching ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                        Memuat data berita...
                      </td>
                    </tr>
                  ) : news.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                        Belum ada berita yang tersedia.
                      </td>
                    </tr>
                  ) : (
                    news.map((item) => {
                      const plainContent = item.content
                        ? item.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
                        : "";
                      const descriptionSnippet = formatNewsDescription(item.content);

                      return (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-6 py-4 align-top">
                            <div className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug" title={item.title}>
                              {item.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <p 
                              className="text-sm text-gray-600 line-clamp-2 leading-relaxed" 
                              title={plainContent || undefined}
                            >
                              {descriptionSnippet}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                            <div className="flex justify-end items-center gap-1.5">
                              <button 
                                onClick={() => openEditModal(item)} 
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Berita"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item.id)} 
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                title="Hapus Berita"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 z-40 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    {editingId ? "Edit Berita" : "Tambah Berita"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 p-1 rounded-md">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form id="newsForm" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Judul</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul berita..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Berita</label>
                    <input
                      type="date"
                      required
                      value={articleDate}
                      onChange={(e) => setArticleDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Konten HTML / Text</label>
                      <span className="text-xs text-gray-400">
                        {content ? `${content.length.toLocaleString('id-ID')} karakter` : "0 karakter"}
                      </span>
                    </div>
                    <textarea
                      required
                      rows={11}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Masukkan isi lengkap konten berita..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm leading-relaxed min-h-[240px] resize-y"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Seluruh isi konten dapat dilihat dan diedit secara penuh di atas (mendukung paragraf teks maupun tag HTML).
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gambar Berita (Opsional)
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-4 py-6 text-sm font-medium text-gray-600 shadow-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <ImagePlus className="h-5 w-5" />
                      Pilih gambar dari komputer
                    </button>

                    {imagePreview && (
                      <div className="relative mt-3 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        {!imageError ? (
                          <img
                            src={imagePreview}
                            alt="Preview gambar berita"
                            className="h-44 w-full rounded-md object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              // Jika URL lokal gagal dan belum dicoba dari domain produksi
                              if (imagePreview.startsWith("/uploads/") && !target.src.includes("tardamuairport.id")) {
                                target.src = `https://tardamuairport.id${imagePreview}`;
                              } else {
                                setImageError(true);
                              }
                            }}
                          />
                        ) : (
                          <div className="flex h-40 flex-col items-center justify-center gap-1.5 p-4 text-center text-gray-400">
                            <ImagePlus className="h-8 w-8 text-gray-300" />
                            <span className="text-xs">Gambar pratinjau belum tersedia atau gagal dimuat</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setImageUrl("");
                            setImageFile(null);
                            setImageError(false);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors shadow-sm"
                          title="Hapus gambar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                <button type="submit" form="newsForm" disabled={isSaving} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors">
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
