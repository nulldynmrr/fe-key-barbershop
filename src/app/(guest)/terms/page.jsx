"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, FileText, Lock, Scale, Info } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { id: "terms", title: "Terms of Service", icon: FileText },
    { id: "privacy", title: "Privacy Policy", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf9] text-[#2b1d19]">
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden bg-[#2b1d19]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#efe2d7_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-[#efe2d7]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-[#efe2d7]/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-center px-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 relative mb-4">
              <Image src="/images/key.png" alt="Key Logo" fill className="object-contain brightness-0 invert opacity-80" />
            </div>
            <h2 className="text-[#efe2d7] text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "var(--font-be-vietnam)" }}>Legal Agreements</h2>
          </div>
          <h1 className="text-4xl md:text-6xl text-[#fdfbf9] mb-4 font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Terms & Privacy
          </h1>
          <p className="text-[#efe2d7]/60 text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Please read these agreements carefully, as they contain important information regarding your legal rights and remedies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-2">
              <p className="text-[10px] font-bold text-[#8b6f66] uppercase tracking-[0.2em] mb-4 ml-4" style={{ fontFamily: "var(--font-be-vietnam)" }}>Sections</p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-[#efe2d7]/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="w-5 h-5 text-[#8b6f66] group-hover:text-[#4a1a1a]" />
                    <span className="text-sm font-bold text-[#2b1d19] group-hover:text-[#4a1a1a]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>{section.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#efe2d7] group-hover:text-[#4a1a1a]" />
                </a>
              ))}

              <div className="mt-8 pt-8 border-t border-[#efe2d7]">
                <p className="text-[10px] font-bold text-[#8b6f66] uppercase tracking-[0.2em] mb-4 ml-4" style={{ fontFamily: "var(--font-be-vietnam)" }}>Quick Links</p>
                <Link href="/login" className="block p-4 text-xs font-bold text-[#4a1a1a] hover:underline">Back to Login</Link>
                <Link href="/home" className="block p-4 text-xs font-bold text-[#4a1a1a] hover:underline">Back to Home</Link>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-24">

            <section id="terms" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#efe2d7]/30 rounded-xl flex items-center justify-center text-[#4a1a1a]">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-3xl text-[#2b1d19] font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Syarat dan Ketentuan (Terms of Service)</h2>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgba(43,29,25,0.05)] border border-[#efe2d7]/50 space-y-8 leading-relaxed text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    1. Ketentuan Umum
                  </h3>
                  <p>Syarat dan Ketentuan ini mengatur penggunaan situs web dan layanan kecerdasan buatan (AI) dari Key Barber. Dengan mengakses situs web ini, mendaftar akun, atau menggunakan layanan pemindaian wajah kami, Anda menyetujui seluruh isi dokumen ini.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    2.Deskripsi Layanan
                  </h3>
                  <p>Key Barber menyediakan layanan analisis morfologi wajah, rekomendasi gaya rambut, instruksi teknis untuk kapster, dan simulasi visual (virtual try-on) menggunakan teknologi kecerdasan buatan (AI). Seluruh hasil analisis dan gambar yang dihasilkan oleh sistem adalah estimasi komputasi dan hanya berfungsi sebagai referensi visual.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    3. Akun Pengguna dan Sistem Koin
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#fdfbf9] rounded-2xl">
                      <p className="font-bold text-sm text-[#2b1d19] mb-1 uppercase tracking-wider">Akses Layanan</p>
                      <p>Layanan dapat diakses melalui akun terdaftar (menggunakan email) atau akun tamu (guest) yang diidentifikasi melalui cookie perangkat Anda. Jika Anda menggunakan akun tamu dan membersihkan cookie peramban (browser), data dan sisa koin Anda akan hilang.</p>
                    </div>
                    <div className="p-4 bg-[#fdfbf9] rounded-2xl">
                      <p className="font-bold text-sm text-[#2b1d19] mb-1 uppercase tracking-wider">Penggunaan Koin</p>
                      <p>Setiap kali Anda menggunakan fitur analisis AI (seperti pemindaian dasar, heatmap wajah, analisis simetri, atau virtual try-on), sistem akan memotong saldo koin (credit) dari akun Anda sesuai tarif yang berlaku.</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-2xl">
                      <p className="font-bold text-sm text-red-800 mb-1 uppercase tracking-wider">Pembelian dan Pengembalian Dana</p>
                      <p className="text-red-900/80">Semua pembelian koin atau paket langganan bersifat final. Key Barber tidak melayani pengembalian dana (refund) untuk koin yang telah terpotong akibat penggunaan sistem AI, terlepas dari kualitas foto yang Anda unggah.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    4. Aturan Pengunggahan Foto
                  </h3>
                  <p className="mb-4">Sistem kami mengharuskan Anda untuk mengunggah foto wajah. Anda wajib mematuhi aturan berikut:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Anda hanya diperbolehkan mengunggah foto wajah Anda sendiri, atau foto orang lain jika Anda telah mengantongi izin eksplisit dari orang tersebut.</li>
                    <li>Dilarang keras mengunggah foto yang mengandung unsur pornografi, kekerasan, gambar yang tidak pantas, atau materi yang melanggar hak cipta.</li>
                    <li>Key Barber berhak memblokir akun Anda secara sepihak jika Anda melanggar aturan pengunggahan foto ini.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    5. Batasan Tanggung Jawab
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-6 border border-[#efe2d7] rounded-2xl">
                      <div className="w-8 h-8 bg-[#efe2d7]/30 rounded-lg flex items-center justify-center text-[#4a1a1a] mb-4">
                        <CpuIcon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#2b1d19] mb-2">Akurasi AI</p>
                      <p className="text-xs">Rekomendasi gaya rambut, persentase risiko, dan gambar virtual try-on yang dihasilkan oleh AI bukan jaminan hasil mutlak.</p>
                    </div>
                    <div className="p-6 border border-[#efe2d7] rounded-2xl">
                      <div className="w-8 h-8 bg-[#efe2d7]/30 rounded-lg flex items-center justify-center text-[#4a1a1a] mb-4">
                        <UsersIcon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#2b1d19] mb-2">Hasil Potongan</p>
                      <p className="text-xs">Kami tidak bertanggung jawab atas ketidaksesuaian hasil potongan rambut asli maupun kelalaian kapster.</p>
                    </div>
                    <div className="p-6 border border-[#efe2d7] rounded-2xl">
                      <div className="w-8 h-8 bg-[#efe2d7]/30 rounded-lg flex items-center justify-center text-[#4a1a1a] mb-4">
                        <Info className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#2b1d19] mb-2">Sistem</p>
                      <p className="text-xs">Layanan bergantung pada pihak ketiga. Kami tidak menjamin ketersediaan 24 jam tanpa gangguan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="privacy" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#efe2d7]/30 rounded-xl flex items-center justify-center text-[#4a1a1a]">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-3xl text-[#2b1d19] font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Kebijakan Privasi (Privacy Policy)</h2>
              </div>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_4px_20px_-4px_rgba(43,29,25,0.05)] border border-[#efe2d7]/50 space-y-8 leading-relaxed text-[#524342]" style={{ fontFamily: "var(--font-plus-jakarta)" }}>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    1. Informasi yang Kami Kumpulkan
                  </h3>
                  <p className="mb-4">Saat Anda menggunakan Key Barber, kami mengumpulkan data berikut:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4a1a1a] mt-2 shrink-0" />
                      <span><strong>Data Akun:</strong> Nama, email, dan password. Untuk akses tamu, kami mencatat cookie perangkat.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4a1a1a] mt-2 shrink-0" />
                      <span><strong>Data Biometrik:</strong> Foto wajah yang Anda unggah untuk keperluan analisis dan simulasi.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4a1a1a] mt-2 shrink-0" />
                      <span><strong>Data Transaksi:</strong> Riwayat pembelian koin (diproses oleh gateway pihak ketiga).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4a1a1a] mt-2 shrink-0" />
                      <span><strong>Data Riwayat AI:</strong> Catatan sistem mengenai penggunaan token API dan hasil rekomendasi.</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    2. Penggunaan Data
                  </h3>
                  <p className="mb-4">Kami menggunakan data Anda secara eksklusif untuk keperluan operasional Key Barber:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Menganalisis proporsi, simetri, dan kondisi rambut melalui AI.</li>
                    <li>Membuat manipulasi gambar (virtual try-on) gaya rambut target.</li>
                    <li>Menyimpan hasil analisis ke dalam fitur "Riwayat" (History).</li>
                    <li>Menghitung pemotongan koin/kredit yang sesuai.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    3.Berbagi Data dengan Pihak Ketiga
                  </h3>
                  <p>Key Barber wajib mengirimkan foto wajah Anda ke penyedia layanan Kecerdasan Buatan pihak ketiga agar fitur dapat bekerja. Kami <strong>tidak menjual</strong> data Anda kepada agen periklanan atau pialang data.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    4. Penyimpanan dan Keamanan Data
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Foto wajah disimpan di direktori penyimpanan lokal peladen (server) Key Barber.</li>
                    <li>Informasi kata sandi disimpan menggunakan algoritma enkripsi (Bcrypt).</li>
                    <li>Kami mengamankan jalur komunikasi data menggunakan standar enkripsi yang wajar.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2b1d19] mb-3 flex items-center gap-2">
                    5. Hak Pengguna
                  </h3>
                  <p>Anda berhak meminta penghapusan akun, sisa koin, serta penghapusan foto wajah asli dan foto hasil AI dari peladen kami secara permanen melalui layanan pelanggan.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-[#efe2d7] text-center bg-white">
        <p className="text-[10px] font-bold text-[#8b6f66] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-be-vietnam)" }}>
          © 2026 KEY BARBER EXPERIENCE
        </p>
      </footer>
    </div>
  );
}

function CpuIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
