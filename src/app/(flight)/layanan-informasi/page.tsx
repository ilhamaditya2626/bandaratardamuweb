"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PageHero, serifStyle } from "../_components/info-page-shell";

type TabKey = "berkala" | "setiap-saat" | "serta-merta" | "dikecualikan";

const infoTabs: { key: TabKey; label: string }[] = [
  { key: "berkala", label: "Informasi Berkala" },
  { key: "setiap-saat", label: "Setiap Saat" },
  { key: "serta-merta", label: "Serta Merta" },
  { key: "dikecualikan", label: "Dikecualikan" },
];

type PublicInfoRow = {
  no: string;
  title: string;
  summary: string;
  owner: string;
  publisher: string;
  form: string;
  placeAndTime: string;
  duration: string;
};

type ExcludedInfoRow = {
  no: string;
  title: string;
  legalBasis: string;
  openedConsequence: string;
  closedConsequence: string;
  duration: string;
  owner: string;
};

const infoRows: Record<Exclude<TabKey, "dikecualikan">, PublicInfoRow[]> = {
  berkala: [
    {
      no: "1",
      title: "Organisasi dan tata kerja Kantor UPBU Tardamu",
      summary: "Ruang lingkup dan tupoksi unit kerja di lingkup Kantor UPBU Tardamu sesuai dengan PM 17 Tahun 2022 tentang Organisasi dan Tata Kerja Kementerian Perhubungan",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "2",
      title: "Struktur Organisasi Kantor UPBU Tardamu",
      summary: "Struktur pejabat mulai dari Kepala Kantor UPBU Tardamu sampai Pejabat Fungsional",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "3",
      title: "Profil Pejabat Kantor UPBU Tardamu",
      summary: "Data diri pejabat mulai dari Kepala Kantor UPBU Tardamu sampai Pejabat Bendahara",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "4",
      title: "Profil Kantor UPBU Tardamu",
      summary: "Gambaran Umum, Alamat Lengkap, Tupoksi, Visi dan Misi Unit Kerja Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "5",
      title: "Agenda Kantor UPBU Tardamu",
      summary: "Agenda kegiatan strategi Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "6",
      title: "LHKPN Pejabat",
      summary: "Laporan Hasil kekayaan kepada KPK",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "7",
      title: "Rekapitulasi Jumlah Pegawai Kantor UPBU Tardamu Selama 1 Tahun Terakhir",
      summary: "Informasi terkait Rekapitulasi Jumlah Pegawai yang Aktif, Kantor UPBU Tardamu Selama 1 Tahun Terakhir",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "8",
      title: "Hasil Survey Kepuasan Masyarakat",
      summary: "Informasi terkait Hasil Survey Kepuasan Masyarakat",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "9",
      title: "Standart Operasional Prosedur (SOP)",
      summary: "SOP yang ada di Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "10",
      title: "Laporan Tahunan Kantor UPBU Tardamu",
      summary: "Informasi terkait Pertanggungjawaban pelaksanaan kebijakan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "11",
      title: "DIPA",
      summary: "Informasi terkait Daftar Isian Penyelenggaraan Anggaran berisi Program dan Kegiatan beserta Anggaran",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "12",
      title: "Laporan Monitoring Capaian Kinerja",
      summary: "Informasi terkait Monitoring Capaian Kinerja",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "13",
      title: "Laporan Keuangan",
      summary: "Informasi terkait Laporan realisasi anggaran, neraca, catatan atas laporan keuangan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "14",
      title: "Laporan Barang Milik Negara (BMN)",
      summary: "Informasi terkait Laporan Barang Milik Negara (BMN) Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "15",
      title: "Dokumen Renstra Kantor UPBU Tardamu Tahun 2025-2029",
      summary: "Informasi terkait Dokumen Renstra Kantor UPBU Tardamu Tahun 2025-2029",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "2 tahun",
    },
    {
      no: "16",
      title: "Peningkatan Kapasitas Pelaksanaan SAKIP Kantor UPBU Tardamu",
      summary: "Informasi terkait Peningkatan Kapasitas Pelaksanaan SAKIP Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "17",
      title: "Perjanjian Kinerja Kantor UPBU Tardamu",
      summary: "Informasi terkait Perjanjian Kinerja Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "18",
      title: "Laporan Akuntabilitas Kinerja Instansi Pemerintah (LAKIP) Kantor UPBU Tardamu",
      summary: "Informasi terkait Laporan LAKIP Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "19",
      title: "Penyelenggaraan SPIP Kantor UPBU Tardamu",
      summary: "Informasi terkait Kegiatan Penyelenggaraan SPIP Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "20",
      title: "Penyusunan Rencana Kerja, Program dan Kegiatan",
      summary: "Informasi terkait Penyusunan Rencana Kerja, Program dan Kegiatan",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "21",
      title: "Penyusunan RKA KL",
      summary: "Informasi terkait Penyusunan RKA KL",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "22",
      title: "Koordinasi Kelembagaan",
      summary: "Informasi terkait Koordinasi Kelembagaan",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "23",
      title: "Monitoring dan Evaluasi Pelaksanaan Rencana dan Program",
      summary: "Informasi terkait Monitoring dan Evaluasi Pelaksanaan Rencana dan Program",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "24",
      title: "Kelompok Kerja Penyusunan Dokumen Perencanaan dan Anggaran pada Kantor UPBU Tardamu Tahun 2025",
      summary: "Informasi terkait Kelompok Kerja Penyusunan Dokumen Perencanaan dan Anggaran pada Kantor UPBU Tardamu Tahun 2025",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "25",
      title: "Data Perbendaharaan dan Inventaris BMN",
      summary: "Informasi mengenai mutasi tambah kurang, penyusutan, penggunaan status, penghapusan BMN yang telah diaudit oleh BPK",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "26",
      title: "Daftar regulasi, peraturan, Surat Keputusan, dan kebijakan Kantor UPBU Tardamu",
      summary: "Daftar peraturan, keputusan dan kebijakan yang diterbitkan untuk mengelola Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Hukum",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "27",
      title: "Data pergerakan Lalu Lintas Angkutan Udara di Kantor UPBU Tardamu",
      summary: "Informasi terkait Data Lalu Lintas Angkutan Udara di Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "28",
      title: "Data Jumlah Kedatangan dan Keberangkatan Penumpang di Terminal Bandara Tardamu",
      summary: "Informasi terkait Data Kedatangan dan Keberangkatan Penumpang di Bandara Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "29",
      title: "Daftar Slot Time Penerbangan Angkutan Udara",
      summary: "Informasi terkait Daftar Slot Time Penerbangan Angkutan Udara",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "30",
      title: "Program Penyelenggaraan Angkutan Lebaran, Natal Dan Tahun Baru 2024",
      summary: "Informasi terkait Program Penyelenggaraan Angkutan Lebaran, Natal Dan Tahun Baru 2024",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "31",
      title: "Kegiatan Pelaksanaan Table TOP Keamanan Bandar Udara Tahun 2025",
      summary: "Informasi terkait Pelaksanaan Table TOP Keamanan Bandar Udara Tahun 2025",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Aviation Security",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "32",
      title: "Surat Keputusan",
      summary: "Seluruh SK yang diterbitkan oleh Bagian Humas Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "33",
      title: "Data Permohonan Informasi Publik melalui website PPID Kantor UPBU Tardamu",
      summary: "Seluruh rekapan data permohonan informasi yang diterima melalui website PPID Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "34",
      title: "Data Pengaduan dan Permohonan Informasi melalui sistem CC 151 Kementerian Perhubungan",
      summary: "Seluruh rekapan data pengaduan dan permohonan informasi yang diteruskan dari Tier I Kementerian Perhubungan kepada Tier III (Kantor UPBU Tardamu) yang diterima melalui sistem CC 151 Kementerian Perhubungan",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "35",
      title: "Data Pengaduan melalui Sistem SP4N LAPOR!",
      summary: "Seluruh rekapan data pengaduan dan permohonan informasi yang diteruskan ke Kantor UPBU Tardamu yang diterima melalui sistem SP4N LAPOR!",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "36",
      title: "Dokumentasi Kegiatan Pimpinan di Lingkungan Kantor UPBU Tardamu",
      summary: "Foto Kegiatan Pimpinan di Lingkungan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "37",
      title: "Struktur PPID Kantor UPBU Tardamu",
      summary: "Struktur PPID Pelaksana dan anggota PPID Pelaksana UPT di Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "38",
      title: "Dokumentasi Isu dan Kebijakan Kantor UPBU Tardamu",
      summary: "Foto dan Video Isu dan Kebijakan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
  ],
  "setiap-saat": [
    {
      no: "1",
      title: "Peta Jabatan",
      summary: "Peta Jabatan dan Uraian Jenis Kegiatan Jabatan Struktural dan Fungsional",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "2",
      title: "Data Statistik PNS dan Pegawai NonPNS Unit Kerja di Lingkungan Kantor UPBU Tardamu",
      summary: "Informasi Jumlah Pegawai Aktif Unit Kerja di Lingkungan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "3",
      title: "Data Statistik Jabatan Fungsional di Lingkungan Kantor UPBU Tardamu",
      summary: "Informasi Jumlah Pejabat Fungsional Tertentu di Lingkungan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "4",
      title: "SOP Tata Naskah dan Persuratan Kantor UPBU Tardamu",
      summary: "Informasi mengenai surat menyurat, proses penomoran surat masuk, surat keluar, Nota Dinas, Peraturan / Keputusan Kepala Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "5",
      title: "Data Operasional Perkantoran UPBU Tardamu",
      summary: "Informasi penyelenggaraan operasional dan pemeliharaan perkantoran (kebutuhan sehari-hari perkantoran, langganan daya, dan jasa pemeliharaan barang operasional lainnya, pemeliharaan kendaraan operasional)",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "6",
      title: "Data Inventaris Kendaraan Bermotor Kantor UPBU Tardamu",
      summary: "Informasi mengenai tahun, jenis, pemegang kendaraan serta BPKB dan STNK kendaraan operasional roda 4 dan roda 2",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "7",
      title: "Data Stok Opname ATK Kantor UPBU Tardamu",
      summary: "Informasi mengenai ketersediaan ATK (Jumlah keluar dan masuknya ATK)",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Tim Urusan Tata Usaha",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "8",
      title: "Laporan perbendaharaan dan invetaris pada Kantor UPBU Tardamu",
      summary: "Laporan akhir mengenai mutasi tambah kurang, penyusutan, penggunaan status, penghapusan BMN yang telah diaudit oleh BPK",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "9",
      title: "Data dan Laporan Penerimaan Negara Bukan Pajak (PNBP)",
      summary: "Jumlah Penerimaan PNBP di Lingkungan Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Perencanaan dan Keuangan",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
    {
      no: "10",
      title: "SOP pada setiap Unit Kerja di Kantor UPBU Tardamu",
      summary: "Informasi terkait SOP pada setiap Unit Kerja di Kantor UPBU Tardamu",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Unit Kerja di Kantor UPBU Tardamu",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "11",
      title: "SOP pengajuan Permintaan Informasi",
      summary: "Informasi terkait SOP pengajuan Permintaan Informasi",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "PPID UPT Kantor UPBU Tardamu",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2024",
      duration: "1 tahun",
    },
  ],
  "serta-merta": [
    {
      no: "1",
      title: "Informasi Posko Angkutan Lebaran dan Nataru 2024",
      summary: "Data informasi terkait dengan lokasi Posko dan Data Angkutan Lebaran dan Nataru 2024",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
    {
      no: "2",
      title: "Data Pergerakan penumpang Datang dan Pergi Melalui Bandara Tardamu pada Masa Lebaran dan Nataru",
      summary: "Data terkait Pergerakan penumpang Datang dan Pergi Melalui Bandara Tardamu pada Masa Lebaran dan Nataru",
      owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
      publisher: "Bagian Humas",
      form: "Softcopy",
      placeAndTime: "Sabu Raijua, 2025",
      duration: "1 tahun",
    },
  ],
};

const excludedRows: ExcludedInfoRow[] = [
  {
    no: "1",
    title: "Laporan Keuangan sebelum diaudit (unaudited) 2025",
    legalBasis: "UU No 17 Tahun 2003, UU No 15 Tahun 2004, dan UU No 14 Tahun 2008 Pasal 17 huruf j.",
    openedConsequence: "Jika informasi dibuka, dapat mengganggu proses pemeriksaan laporan keuangan negara.",
    closedConsequence: "Jika informasi ditutup, maka dapat melindungi proses pemeriksaan laporan keuangan negara.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "2",
    title: "Rincian Satuan Harga Penawaran dan Nomor Rekening yang Terdapat Dalam Dokumen tender Barang/Jasa Pihak Ketiga (Perusahaan)",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf b dan huruf h angka 3.",
    openedConsequence: "Dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat, serta mengungkap rahasia pribadi/kondisi keuangan seseorang.",
    closedConsequence: "Dapat melindungi kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "3",
    title: "Data pribadi ASN Kementerian Perhubungan yang tercantum dalam Undang-Undang Nomor 14 Tahun 2008 huruf h",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf h.",
    openedConsequence: "Jika informasi dibuka, dapat mengungkapkan rahasia pribadi.",
    closedConsequence: "Jika informasi ditutup, maka dapat melindungi rahasia pribadi.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "4",
    title: "Proses mutasi pegawai",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf h.",
    openedConsequence: "Jika informasi dibuka, dapat mengungkapkan rahasia pribadi.",
    closedConsequence: "Jika informasi ditutup, maka dapat melindungi rahasia pribadi.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "5",
    title: "Memorandum dan atau surat-surat yang menurut sifatnya dirahasiakan",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf i.",
    openedConsequence: "Jika informasi dibuka, dapat mengganggu pertahanan dan keamanan negara.",
    closedConsequence: "Jika informasi ditutup, maka dapat melindungi pertahanan dan keamanan negara.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "6",
    title: "Informasi pengadaan barang dan jasa atas kegiatan/pembangunan yang belum melalui proses audit",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf b.",
    openedConsequence: "Dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat.",
    closedConsequence: "Dapat melindungi kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "7",
    title: "Rancangan cetak biru sarana dan prasarana transportasi",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf b.",
    openedConsequence: "Dapat mengganggu kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat.",
    closedConsequence: "Dapat melindungi kepentingan perlindungan hak atas kekayaan intelektual dan perlindungan dari persaingan usaha tidak sehat.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "8",
    title: "Data pribadi responden survei",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf h angka 1, angka 3, dan angka 5.",
    openedConsequence: "Jika informasi dibuka, dapat mengungkapkan rahasia pribadi.",
    closedConsequence: "Jika informasi ditutup, maka dapat melindungi rahasia pribadi.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "9",
    title: "Hak akses CCTV area/daerah keamanan terbatas",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf j dan UU No 1 Tahun 2023 Pasal 333 huruf d.",
    openedConsequence: "Apabila dibuka, dapat melanggar ketentuan pada undang-undang.",
    closedConsequence: "Apabila ditutup, dapat melindungi sistem elektronik milik pemerintah sesuai dengan ketentuan pada undang-undang.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
  {
    no: "10",
    title: "Informasi terkait Proses Pemeriksaan Tindak Pidana Penerbangan sebelum dilimpahkan ke Kejaksaan",
    legalBasis: "UU No 14 Tahun 2008 Pasal 17 huruf A dan huruf H.",
    openedConsequence: "Apabila dibuka, dapat mengganggu proses penegakan hukum dan mengungkap rahasia pribadi (riwayat/kondisi anggota keluarga).",
    closedConsequence: "Apabila ditutup, dapat membantu kelancaran proses penegakan hukum.",
    duration: "1 Tahun",
    owner: "PPID Pelaksana UPT Kantor UPBU Tardamu",
  },
];

const imagePanels = [
  {
    id: "maklumat-pelayanan",
    title: "Maklumat Pelayanan",
    src: "/assets/images/maklumat pelayanan.webp",
    alt: "Maklumat Pelayanan",
  },
  {
    id: "standar-biaya",
    title: "Standar Biaya",
    src: "/assets/images/standart biaya.webp",
    alt: "Standar Biaya",
  },
  {
    id: "prosedur",
    title: "Prosedur Permohonan Informasi",
    src: "/assets/images/permohonan informasi.webp",
    alt: "Prosedur Permohonan",
  },
  {
    id: "keberatan",
    title: "Prosedur Permohonan Keberatan",
    src: "/assets/images/permohonan keberatan.webp",
    alt: "Prosedur Keberatan",
  },
  {
    id: "sengketa",
    title: "Prosedur Pengajuan Sengketa Informasi Publik ke Komisi Informasi Pusat",
    src: "/assets/images/penyelesaian keberatan.webp",
    alt: "Prosedur Sengketa Informasi",
  },
  {
    id: "hak-hak-pemohon",
    title: "Hak-Hak Pemohon Informasi",
    src: "/assets/images/hak-hak.webp",
    alt: "Hak-Hak Pemohon Informasi",
  },
];

const formCards = [
  {
    href: "https://forms.gle/6N2LZZqUjs8HBjQW7",
    icon: "fa-file-invoice",
    title: "Permohonan Informasi",
    description:
      "Gunakan formulir ini untuk mengajukan permintaan informasi publik secara resmi.",
  },
  {
    href: "https://forms.gle/YprafGdtnNjX2FpB9",
    icon: "fa-file-shield",
    title: "Pengajuan Keberatan",
    description:
      "Formulir resmi untuk menyampaikan keberatan atas tanggapan permintaan informasi.",
  },
];

const complaintChannels = [
  {
    icon: "fa-headset",
    title: "Contact Center 151",
    description:
      "Sambungan langsung melalui telepon (021) 151 untuk informasi dan pengaduan cepat.",
    href: "tel:151",
    label: "Hubungi: 151",
  },
  {
    icon: "fa-user-secret",
    title: "SIMADU (WBS)",
    description:
      "Sistem Manajemen Pengaduan untuk pelaporan pelanggaran KKN (Korupsi, Kolusi, Nepotisme).",
    href: "https://simadu.dephub.go.id",
    label: "Akses Sistem",
  },
  {
    icon: "fa-bullhorn",
    title: "SP4N - LAPOR",
    description:
      "Layanan aspirasi dan pengaduan online rakyat yang terintegrasi secara nasional.",
    href: "https://lapor.go.id",
    label: "Kunjungi Website",
  },
];

export default function LayananInformasiPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("berkala");
  const rows = useMemo(
    () => (activeTab === "dikecualikan" ? [] : infoRows[activeTab]),
    [activeTab],
  );

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      const target = document.getElementById(hash);
      if (!target) return;

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return (
    <div className="bg-[#111928] text-gray-200">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <PageHero
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
        gradient="linear-gradient(to bottom, rgba(17, 25, 40, 0.85), rgba(17, 25, 40, 1))"
        breadcrumbs={[{ href: "/", label: "Beranda" }, { label: "Layanan Informasi" }]}
        title={
          <>
            Informasi <span className="italic text-[#facc15]">Publik</span>
          </>
        }
        description="Wujud transparansi dan akuntabilitas pelayanan informasi publik di lingkungan Bandara Tardamu Sabu Raijua."
      />

      <main className="mx-auto max-w-7xl space-y-32 px-6 py-20">
        <section id="daftar-informasi" className="scroll-mt-28 md:scroll-mt-32">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-gray-800 md:flex-row md:items-end">
            <div className="pb-4">
              <h2 className="text-3xl italic text-white" style={serifStyle}>
                Daftar Informasi Publik
              </h2>
            </div>
            <div className="flex space-x-8 overflow-x-auto text-sm">
              {infoTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap border-b-2 pb-4 transition ${activeTab === tab.key
                    ? "border-[#facc15] text-[#facc15]"
                    : "border-transparent text-gray-400"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#1f2937] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] text-center">
                {activeTab === "dikecualikan" ? (
                  <>
                    <thead>
                      <tr>
                        {[
                          "No",
                          "Informasi",
                          "Dasar Hukum Pengecualian Informasi",
                          "Konsekuensi/Pertimbangan Dibuka bagi Publik",
                          "Konsekuensi/Pertimbangan Ditutup bagi Publik",
                          "Jangka Waktu",
                          "Penanggung Jawab",
                        ].map((title, index) => (
                          <th
                            key={title}
                            className={`border-b-2 border-[#374151] bg-[#1f2937] px-4 py-5 text-center text-[0.75rem] uppercase tracking-[0.05em] text-[#facc15] ${index === 0 ? "w-16" : ""
                              }`}
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excludedRows.length > 0 ? (
                        excludedRows.map((row) => (
                          <tr key={`dikecualikan-${row.no}`}>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.no}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] font-bold text-white">
                              {row.title}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.legalBasis}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.openedConsequence}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.closedConsequence}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.duration}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.owner}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-20 text-center text-gray-600">
                            Data sedang diperbarui atau belum tersedia.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead>
                      <tr>
                        {[
                          "No",
                          "Informasi",
                          "Ringkasan Informasi",
                          "Pejabat Yang Menguasai Informasi",
                          "Penerbit Informasi",
                          "Bentuk Informasi",
                          "Tempat Dan Waktu Pembuatan",
                          "Jangka Waktu",
                        ].map((title, index) => (
                          <th
                            key={title}
                            className={`border-b-2 border-[#374151] bg-[#1f2937] px-4 py-5 text-center text-[0.75rem] uppercase tracking-[0.05em] text-[#facc15] ${index === 0 ? "w-16" : ""
                              }`}
                          >
                            {title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length > 0 ? (
                        rows.map((row) => (
                          <tr key={`${activeTab}-${row.no}`}>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.no}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] font-bold text-white">
                              {row.title}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.summary}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.owner}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.publisher}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.form}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.placeAndTime}
                            </td>
                            <td className="border-b border-white/5 px-4 py-4 text-center text-[0.85rem] text-gray-300">
                              {row.duration}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="py-20 text-center text-gray-600">
                            Data sedang diperbarui atau belum tersedia.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        </section>

        {imagePanels.map((panel) => (
          <section key={panel.id} id={panel.id} className="scroll-mt-28 md:scroll-mt-32">
            <div className="mb-10 text-center">
              <h2 className="text-3xl text-white" style={serifStyle}>
                {panel.title}
              </h2>
            </div>
            <div className="img-placeholder mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#1f2937] shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <Image
                src={panel.src}
                alt={panel.alt}
                width={3200}
                height={4800}
                sizes="(max-width: 1280px) 100vw, 1024px"
                className="h-auto w-full"
              />
            </div>
          </section>
        ))}

        <section id="formulir" className="scroll-mt-28 md:scroll-mt-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl text-white md:text-4xl" style={serifStyle}>
              Formulir Layanan Elektronik
            </h2>
            <p className="text-gray-500">
              Silahkan pilih jenis formulir yang ingin Anda akses melalui Google Form
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {formCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[32px] border border-white/5 bg-[rgba(31,41,55,0.6)] p-10 transition-all duration-500 hover:border-[#facc15]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#facc15]/10 text-3xl text-[#facc15] transition group-hover:scale-110">
                    <i className={`fa-solid ${card.icon}`}></i>
                  </div>
                  <i className="fa-solid fa-arrow-up-right-from-square text-gray-600 group-hover:text-[#facc15]"></i>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{card.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="pengaduan" className="scroll-mt-28 md:scroll-mt-32">
          <div className="rounded-[40px] border border-white/5 bg-[#1f2937]/30 p-12 md:p-20">
            <div className="mb-16 max-w-3xl">
              <h2 className="mb-6 text-3xl text-white md:text-5xl" style={serifStyle}>
                Informasi & <span className="italic text-[#facc15]">Pengaduan</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-400">
                Kanal resmi layanan informasi dan pengaduan masyarakat di bawah naungan
                Kementerian Perhubungan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {complaintChannels.map((item) => (
                <div key={item.title} className="space-y-6">
                  <div className="text-4xl text-[#facc15]">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h4 className="text-xl font-bold text-white">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-2 font-bold text-[#facc15] transition-all hover:gap-4"
                  >
                    {item.label} <i className="fa-solid fa-chevron-right text-xs"></i>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
