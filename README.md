# Key Barbershop Frontend

Platform digital yang menghadirkan standar baru dalam industri grooming melalui personalisasi berbasis teknologi dan desain antarmuka yang intuitif.

## Pilar Utama Layanan

### Personalisasi Gaya
Kami menghadirkan pengalaman yang benar-benar personal bagi setiap pelanggan. Melalui analisis karakteristik visual yang mendalam, platform ini memberikan rekomendasi gaya rambut yang paling sesuai dengan profil unik setiap individu, memastikan kepuasan maksimal sebelum langkah pertama pemotongan dilakukan.

### Ekosistem Digital Pelanggan
- **Manajemen Keanggotaan**: Sistem yang dirancang untuk memberikan nilai tambah bertahap, mulai dari akses dasar hingga layanan eksklusif bagi anggota premium.
- **Inspirasi Tanpa Batas**: Integrasi konten kreatif dari berbagai platform media sosial untuk memastikan pelanggan selalu mendapatkan tren terbaru secara langsung.
- **Navigasi Reservasi**: Alur yang efisien untuk memudahkan eksplorasi layanan dan pemesanan jadwal kunjungan.

### Pusat Kendali Operasional
Solusi manajemen terpadu bagi administrator untuk memantau metrik bisnis, mengelola data operasional barber, serta melakukan kalibrasi parameter teknologi secara real-time demi menjaga kualitas layanan.

## Arsitektur Teknologi

Aplikasi ini dibangun menggunakan tatanan teknologi modern yang mengutamakan kecepatan dan stabilitas:

- **Inti Framework**: Next.js 14 (App Router)
- **Visual & Interaksi**: Tailwind CSS 4, Framer Motion, AOS
- **Integrasi Data**: Axios & React Context API
- **Komponen Antarmuka**: Shadcn UI, Radix UI, Lucide Icons
- **Analitik Visual**: Recharts
- **Keamanan Akses**: Google OAuth

## Memulai Pengembangan

### Persiapan Lingkungan
Pastikan perangkat Anda telah menggunakan Node.js versi 18.x atau yang lebih baru.

### Langkah Instalasi
1. Gandakan repositori ke direktori lokal.
2. Pasang dependensi yang diperlukan:
   ```bash
   npm install
   ```
3. Jalankan lingkungan pengembangan:
   ```bash
   npm run dev
   ```
4. Aplikasi dapat diakses melalui alamat `http://localhost:3000`.

## Struktur Organisasi Kode

- `src/app`: Definisi rute, layout, dan logika halaman utama.
- `src/components`: Pustaka komponen antarmuka yang modular.
- `src/services`: Layer komunikasi data dengan sistem backend.
- `src/contexts`: Pengelola status global aplikasi.
- `src/lib` & `src/utils`: Konfigurasi teknis dan fungsi pembantu.

---
Dedikasi untuk menghadirkan pengalaman grooming yang cerdas dan berkelas.
