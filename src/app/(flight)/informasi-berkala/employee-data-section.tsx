"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { serifStyle } from "../_components/info-page-shell";

const statusData = [
  { name: "CPNS / PNS", value: 34, color: "#facc15" },
  { name: "PPPK & paruh waktu", value: 38, color: "#38bdf8" },
];

const ageData = [
  { name: "20-30", value: 30, percent: "41,7%", color: "#facc15" },
  { name: "31-40", value: 26, percent: "36,1%", color: "#2f80ed" },
  { name: "41-50", value: 13, percent: "18,1%", color: "#4fb3a8" },
  { name: "> 50", value: 4, percent: "5,6%", color: "#7dd3fc" },
];

const educationData = [
  { name: "SMA/SMK", value: 45, fill: "#facc15" },
  { name: "D II", value: 5, fill: "#60a5fa" },
  { name: "D III", value: 12, fill: "#38bdf8" },
  { name: "S1", value: 10, fill: "#4fb3a8" },
];

const rankData = [
  { name: "Gol. V", value: 1 },
  { name: "Gol. IV", value: 2 },
  { name: "Gol. III/d", value: 5 },
  { name: "Gol. III/c", value: 8 },
  { name: "Gol. III/b", value: 10 },
  { name: "Gol. III/a", value: 6 },
  { name: "Gol. II/d", value: 15 },
  { name: "Gol. II/c", value: 22 },
  { name: "Gol. II/b", value: 3 },
];

const unitData = [
  { name: "AVSEC", pns: 8, pppk: 9 },
  { name: "PKP-PK", pns: 6, pppk: 4 },
  { name: "A2B", pns: 1, pppk: 3 },
  { name: "Bangland", pns: 3, pppk: 8 },
  { name: "Elband", pns: 2, pppk: 3 },
  { name: "Listrik", pns: 6, pppk: 2 },
  { name: "Tata Usaha", pns: 9, pppk: 6 },
  { name: "Quality Control", pns: 2, pppk: 0 },
  { name: "Landscape", pns: 0, pppk: 3 },
];

const positionData = [
  { name: "Operator Layanan Operasional", value: 5 },
  { name: "Pengadministrasi Perkantoran", value: 22 },
  { name: "Pengelola Layanan Operasional", value: 10 },
  { name: "Penata Layanan Operasional", value: 4 },
  { name: "Personel Penerbangan", value: 12 },
  { name: "Pengawas Operasional Penerbangan", value: 6 },
  { name: "Pengawas Personel Penerbangan", value: 2 },
  { name: "Teknisi Penerbangan Terampil", value: 5 },
  { name: "Bidang AVSEC", value: 2 },
  { name: "Pengevaluasi Keselamatan", value: 1 },
  { name: "Penelaah Teknis Kebijakan", value: 1 },
  { name: "Kepala Kantor", value: 1 },
];

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

export function EmployeeDataSection() {
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
              <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-300">Total Pegawai Aktif</p><p className="mt-1 text-4xl font-black text-white">72 <span className="text-sm font-medium text-gray-400">personel</span></p></div>
            </div>
          </article>
          {statusData.map((item) => (
            <article key={item.name} className="rounded-[28px] border border-white/10 bg-[#111928]/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${item.color}20`, color: item.color }}><i className={`fa-solid ${item.name.startsWith("CPNS") ? "fa-user-tie" : "fa-briefcase"}`} /></span><p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-300">{item.name}</p></div>
              <p className="mt-6 text-4xl font-black text-white">{item.value} <span className="text-sm font-medium text-gray-400">personel</span></p>
              <p className="mt-2 text-sm font-bold" style={{ color: item.color }}>{((item.value / 72) * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <ChartCard title="Tingkat Usia Pegawai">
            <div className="h-[265px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ageData} dataKey="value" nameKey="name" innerRadius="54%" outerRadius="78%" paddingAngle={3}>{ageData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value, _name, entry) => [`${value} personel (${entry.payload.percent})`, "Jumlah"]} /></PieChart></ResponsiveContainer></div>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-3">{ageData.map((item) => <div key={item.name} className="flex items-center justify-between gap-2 text-xs text-gray-300"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name} tahun</span><b>{item.percent}</b></div>)}</div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">Sebagian besar pegawai berada pada usia produktif di bawah 40 tahun.</p>
          </ChartCard>

          <ChartCard title="Tingkat Pendidikan">
            <div className="h-[265px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={educationData} margin={{ top: 12, right: 10, left: -10, bottom: 0 }}><XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} labelFormatter={(label) => { const item = educationData.find((entry) => entry.name === label); return `${label} - ${item?.value ?? 0} personel`; }} formatter={(value) => [`${value} personel`, "Jumlah Pegawai"]} /><Bar dataKey="value" radius={[8, 8, 0, 0]}>{educationData.map((item) => <Cell key={item.name} fill={item.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
            <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-gray-400">Pendidikan SMA/SMK masih mendominasi, dengan pengembangan kompetensi terus berjalan.</p>
          </ChartCard>

          <ChartCard title="Komposisi Pangkat / Golongan">
            <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={rankData} layout="vertical" margin={{ top: 0, right: 20, left: 12, bottom: 0 }}><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={62} tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} personel`, "Jumlah"]} /><Bar dataKey="value" fill="#4fb3a8" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>
          </ChartCard>

          <ChartCard title="Rekapitulasi SDM per Unit Kerja" className="xl:col-span-2">
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={unitData}
                  margin={{ top: 10, right: 10, left: 15, bottom: 25 }}
                  barGap={3}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#cbd5e1", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={65}
                    dy={4}
                  />
                  <YAxis
                    width={78}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickFormatter={(value) => `${value} Personel`}
                    domain={[0, 14]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} personel`, "Jumlah"]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }}
                  />
                  <Bar dataKey="pns" name="PNS/CPNS" fill="#4f7fee" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pppk" name="PPPK" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Komposisi Jabatan">
            <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={positionData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}><XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={150} tick={{ fill: "#cbd5e1", fontSize: 9 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} personel`, "Jumlah"]} /><Bar dataKey="value" fill="#2f80ed" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer></div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
