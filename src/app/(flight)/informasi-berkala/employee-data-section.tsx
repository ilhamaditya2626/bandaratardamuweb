"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { serifStyle } from "../_components/info-page-shell";
import type { RekapKepegawaian } from "@/lib/rekap-kepegawaian";

const ageColors = ["#facc15", "#2f80ed", "#4fb3a8", "#7dd3fc"];

function formatPercent(value: number, total: number) {
  const percent = total > 0 ? (value / total) * 100 : 0;
  return `${percent.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;
}

export type EmployeeRecord = {
  jabatan: string | null;
  pendidikan_terakhir: string | null;
  divisi_nama: string | null;
};

const educationColors: Record<string, string> = {
  "SMA/SMK": "#facc15",
  "D II": "#60a5fa",
  "D III": "#38bdf8",
  S1: "#4fb3a8",
  S2: "#a78bfa",
  Lainnya: "#94a3b8",
};

// Menyeragamkan tulisan pendidikan (misalnya "S-1", "SLTA", "D-III") ke satu kelompok.
function normalizeEducation(value: string | null) {
  const text = (value ?? "").toUpperCase().replace(/[\s-]/g, "");
  if (text.startsWith("S2")) return "S2";
  if (text.startsWith("S1")) return "S1";
  if (text.startsWith("DIII") || text.startsWith("D3")) return "D III";
  if (text.startsWith("DII") || text.startsWith("D2")) return "D II";
  if (/^(SMA|SMK|SLTA|SMU|STM|SMEA|PAKETC)/.test(text)) return "SMA/SMK";
  return "Lainnya";
}

function countBy(records: EmployeeRecord[], getKey: (record: EmployeeRecord) => string) {
  const counts = new Map<string, number>();
  records.forEach((record) => {
    const key = getKey(record);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return counts;
}

const tooltipStyle = {
  backgroundColor: "#111928",
  border: "1px solid rgba(250, 204, 21, 0.35)",
  borderRadius: "14px",
  color: "#f8fafc",
  fontSize: "12px",
};

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <article className={`rounded-[28px] border border-white/10 bg-[#111928]/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-7 ${className}`}>
      <h3 className="mb-6 text-sm font-black uppercase tracking-[0.12em] text-white">{title}</h3>
      {children}
    </article>
  );
}

export function EmployeeDataSection({ pegawai, rekap }: { pegawai: EmployeeRecord[]; rekap: RekapKepegawaian }) {
  const totalPegawai = pegawai.length;
  const statusValue = (name: string) => rekap.status.find((item) => item.name === name)?.value ?? 0;
  const statusData = [
    { name: "CPNS / PNS", value: statusValue("PNS") + statusValue("CPNS"), color: "#facc15" },
    { name: "PPPK & paruh waktu", value: statusValue("PPPK") + statusValue("PPPK Paruh Waktu"), color: "#38bdf8" },
  ];
  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0);

  const ageTotal = rekap.usia.reduce((sum, item) => sum + item.value, 0);
  const ageData = rekap.usia.map((item, index) => ({
    ...item,
    percent: formatPercent(item.value, ageTotal),
    color: ageColors[index % ageColors.length],
  }));
  const underForty = rekap.usia.slice(0, 2).reduce((sum, item) => sum + item.value, 0);
  const ageSummary =
    ageTotal > 0
      ? `${formatPercent(underForty, ageTotal)} pegawai berusia 40 tahun ke bawah.`
      : "Belum ada data rekap usia.";
  const rankData = rekap.golongan;
  const rekapNote = `Rekap per ${rekap.periode}`;

  const educationCounts = countBy(pegawai, (p) => normalizeEducation(p.pendidikan_terakhir));
  const educationData = ["SMA/SMK", "D II", "D III", "S1", "S2", "Lainnya"]
    .filter((name) => (educationCounts.get(name) ?? 0) > 0 || ["SMA/SMK", "D II", "D III", "S1"].includes(name))
    .map((name) => ({ name, value: educationCounts.get(name) ?? 0, fill: educationColors[name] }));

  const topEducation = educationData.reduce((top, item) => (item.value > top.value ? item : top), educationData[0]);
  const educationSummary =
    totalPegawai > 0
      ? `Pendidikan ${topEducation.name} paling banyak, yaitu ${topEducation.value} dari ${totalPegawai} pegawai.`
      : "Belum ada data pegawai.";

  const unitData = Array.from(countBy(pegawai, (p) => p.divisi_nama?.trim() || "Belum ada divisi"))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const positionData = Array.from(countBy(pegawai, (p) => p.jabatan?.trim() || "Belum diisi"))
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <section id="data-kepegawaian" className="scroll-mt-24 bg-[#0b1220] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#facc15]">Data Kepegawaian</p>
          <h2 className="text-3xl leading-tight text-white md:text-5xl" style={serifStyle}>
            Potret SDM UPBU <span className="italic text-[#facc15]">Tardamu Sabu</span>
          </h2>
          <p className="mt-5 text-sm leading-7 text-gray-400 md:text-base">
            Komposisi sumber daya manusia yang mendukung layanan penerbangan, administrasi, serta keselamatan dan keamanan operasional.
          </p>
        </div>

        <div className="mb-6 grid gap-5 lg:grid-cols-3">
          <article className="relative overflow-hidden rounded-[28px] border border-[#facc15]/30 bg-gradient-to-br from-[#26334a] to-[#111928] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:col-span-1">
            <i className="fa-solid fa-users absolute -bottom-7 -right-5 text-[150px] text-white/[0.04]" />
            <div className="relative flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-2xl text-[#111928]"><i className="fa-solid fa-users" /></span>
              <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-300">Total Pegawai Aktif</p><p className="mt-1 text-4xl font-black text-white">{totalPegawai} <span className="text-sm font-medium text-gray-400">personel</span></p></div>
            </div>
          </article>
          {statusData.map((item) => (
            <article key={item.name} className="rounded-[28px] border border-white/10 bg-[#111928]/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${item.color}20`, color: item.color }}><i className={`fa-solid ${item.name.startsWith("CPNS") ? "fa-user-tie" : "fa-briefcase"}`} /></span><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-300">{item.name}</p></div>
              <p className="mt-6 text-4xl font-black text-white">{item.value} <span className="text-sm font-medium text-gray-400">personel</span></p>
              <p className="mt-2 text-sm font-bold" style={{ color: item.color }}>{formatPercent(item.value, statusTotal)}</p>
            </article>
          ))}
        </div>
        <p className="-mt-3 mb-6 text-right text-[11px] italic text-gray-500">Status kepegawaian: {rekapNote}</p>

        <div className="grid gap-6 xl:grid-cols-3">
          <ChartCard title="Tingkat Usia Pegawai">
            <div className="h-[265px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ageData} dataKey="value" nameKey="name" innerRadius="54%" outerRadius="78%" paddingAngle={3}>{ageData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value, _name, entry) => [`${value} personel (${entry.payload.percent})`, "Jumlah"]} /></PieChart></ResponsiveContainer></div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">{ageData.map((item) => <div key={item.name} className="flex items-center justify-between gap-2 text-xs text-gray-300"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name} tahun</span><b>{item.percent}</b></div>)}</div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">{ageSummary} <span className="italic text-gray-500">{rekapNote}.</span></p>
          </ChartCard>

          <ChartCard title="Tingkat Pendidikan">
            <div className="h-[265px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={educationData} margin={{ top: 12, right: 0, left: -22, bottom: 0 }}><XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} labelFormatter={(label) => { const item = educationData.find((entry) => entry.name === label); return `${label} - ${item?.value ?? 0} personel`; }} formatter={(value) => [`${value} personel`, "Jumlah Pegawai"]} /><Bar dataKey="value" radius={[8, 8, 0, 0]}>{educationData.map((item) => <Cell key={item.name} fill={item.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">{educationSummary}</p>
          </ChartCard>

          <ChartCard title="Komposisi Pangkat / Golongan">
            <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={rankData} layout="vertical" margin={{ top: 0, right: 20, left: 12, bottom: 0 }}><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={62} tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} personel`, "Jumlah"]} /><Bar dataKey="value" fill="#4fb3a8" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs italic leading-5 text-gray-500">{rekapNote}.</p>
          </ChartCard>

          <ChartCard title="Rekapitulasi SDM per Unit Kerja" className="xl:col-span-2">
            <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={unitData} margin={{ top: 10, right: 5, left: -18, bottom: 0 }} barGap={4}><XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} /><YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(value) => `${value} Personel`} allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} personel`, "Jumlah"]} /><Bar dataKey="value" name="Pegawai" fill="#4f7fee" radius={[7, 7, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </ChartCard>

          <ChartCard title="Komposisi Jabatan">
            <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={positionData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={150} tick={{ fill: "#cbd5e1", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} personel`, "Jumlah"]} /><Bar dataKey="value" fill="#2f80ed" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}