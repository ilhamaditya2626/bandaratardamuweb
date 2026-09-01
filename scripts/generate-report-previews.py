from pathlib import Path
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    ROOT / "public/assets/pdf/laporan/LAKIP 2024.pdf": ROOT / "public/assets/pdf/previews/laporan-tahunan-2024-preview.pdf",
    ROOT / "public/assets/pdf/laporan/LAKIP 2025.pdf": ROOT / "public/assets/pdf/previews/laporan-tahunan-2025-preview.pdf",
    ROOT / "public/assets/pdf/laporan/DIP 2024.pdf": ROOT / "public/assets/pdf/previews/dip-2024-preview.pdf",
    ROOT / "public/assets/pdf/laporan/DIK 2024.pdf": ROOT / "public/assets/pdf/previews/dik-2024-preview.pdf",
}

for source, output in SOURCES.items():
    reader = PdfReader(str(source))
    preview_pages = max(1, -(-len(reader.pages) // 5))
    writer = PdfWriter()
    for page in reader.pages[:preview_pages]:
        writer.add_page(page)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as file:
        writer.write(file)
    print(f"{output.name}: {preview_pages}/{len(reader.pages)} pages")
