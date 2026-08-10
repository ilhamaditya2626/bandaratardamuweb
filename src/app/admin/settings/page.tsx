"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { KeyRound, Lock, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutOthers, setSignOutOthers] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Password baru tidak boleh sama dengan password lama.");
      return;
    }

    setLoading(true);
    try {
      const { error: apiError } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: signOutOthers,
      });

      if (apiError) {
        setError(
          apiError.message ||
            "Gagal mengganti password. Pastikan password lama benar."
        );
      } else {
        setSuccess("Password berhasil diganti.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola kredensial login admin Anda.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Ganti Password
            </h2>
            <p className="text-xs text-slate-500">
              Gunakan password yang kuat dan tidak dipakai di tempat lain.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-md text-sm">
            <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-start gap-2 bg-green-50 text-green-700 p-3 rounded-md text-sm">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleChangePassword}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password Lama
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                placeholder="Password saat ini"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                placeholder="Minimal 8 karakter"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                placeholder="Ulangi password baru"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={signOutOthers}
              onChange={(e) => setSignOutOthers(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Keluarkan sesi login lain setelah ganti password
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Simpan Password Baru"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
