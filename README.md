# Key Barbershop - Frontend

Aplikasi frontend modern untuk **Key Barbershop**, dibangun menggunakan **Next.js 14** dengan fitur unggulan **AI Hair Transformation**. Project ini dirancang untuk memberikan pengalaman premium bagi pelanggan barbershop dan kemudahan manajemen bagi admin.

## Fitur Utama

### AI Hair Transformation
- **Analisis Wajah**: Menggunakan AI untuk menganalisis bentuk wajah pengguna.
- **Rekomendasi Gaya**: Memberikan rekomendasi gaya rambut yang paling sesuai berdasarkan hasil analisis.
- **Visualisasi**: (Segera hadir/Eksperimental) Visualisasi transformasi gaya rambut secara real-time.

### User Experience
- **Sistem Keanggotaan**: Fitur Free dan Premium dengan akses konten yang berbeda.
- **Social Media Gallery**: Integrasi feed media sosial untuk inspirasi gaya rambut terbaru.
- **Layanan**: Informasi lengkap mengenai layanan barbershop yang tersedia.

### Pembayaran & Transaksi
- **Integrasi Gateway**: Sistem pembayaran yang aman untuk upgrade keanggotaan Premium.
- **Riwayat Transaksi**: Pengguna dapat melihat riwayat pembayaran mereka.

### Dashboard Admin
- **Analisis Statistik**: Grafik pendapatan dan statistik penggunaan AI menggunakan Recharts.
- **Manajemen Barber**: Kelola data barber yang bertugas.
- **Konfigurasi AI**: Pengaturan model dan parameter AI langsung dari dashboard.
- **Kelola Konten**: Update gallery media sosial dan daftar layanan.

## Teknologi

Aplikasi ini dibangun dengan teknologi mutakhir:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **State Management & Data**: [Axios](https://axios-http.com/), [React Context API](https://react.dev/learn/passing-data-deeply-with-context)[Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Authentication**: [Google OAuth](https://github.com/MomenSherif/react-oauth)

## Memulai (Getting Started)

### Prasyarat
- Node.js 18.x atau versi terbaru
- NPM atau Yarn

### Instalasi

1. Clone repository ini.
2. Masuk ke direktori project:
   ```bash
   cd fe-key-barbershop
   ```
3. Install dependensi:
   ```bash
   npm install
   ```

### Pengembangan

Jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Struktur Folder

- `src/app`: Routing utama menggunakan App Router (Admin, Auth, Guest).
- `src/components`: Komponen UI yang reusable.
- `src/services`: Logika integrasi API (Axios).
- `src/contexts`: Manajemen state global (Auth, UI).
- `src/lib`: Konfigurasi library pihak ketiga.
- `src/utils`: Fungsi pembantu (helpers).
- `public`: Aset statis seperti gambar dan ikon.

## Catatan Tambahan

Pastikan file `.env` sudah terkonfigurasi dengan benar untuk menghubungkan aplikasi dengan Backend API dan layanan AI.
