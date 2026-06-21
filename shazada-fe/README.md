This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First copy .env.example to .env.local (alse make this file)

```bash
#install all dependecy
npm install

```

then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# SHAZADA — E-Commerce Platform

Platform e-commerce general modern berbasis **Next.js** dan **Supabase** yang dilengkapi dengan fitur perbelanjaan lengkap, manajemen produk dinamis, serta dashboard admin terintegrasi.

---

## 🚀 Fitur yang Sudah Selesai

### 🌓 Dark Mode

- **Toggle Navbar Layout:** Kemudahan perpindahan tema gelap (dark mode) dan terang (light mode) yang disematkan langsung pada komponen navbar global.

### 📦 Produk & Kategori

- **Product Card:** Menampilkan visual produk, nama, harga (terformat dalam Rupiah), jumlah stok, dan kategori terkait.
  - _Indikator Stok:_ Stok $\le$ 3 otomatis ditandai dengan warna peringatan (warning).
  - _Stok Habis:_ Menampilkan overlay visual "Stok Habis" dan menonaktifkan interaksi tertentu.
- **Card Category:** Grid responsif yang menampilkan ikon (gambar atau _fallback icon_), judul, dan deskripsi singkat dari kategori produk.
- **Detail Modal Produk:** Pop-up informatif yang menyajikan data lengkap produk (nama, kategori, harga, stok, tanggal dibuat/diperbarui, dan deskripsi) dengan tata letak rapi dan status stok berwarna dinamis.

### 🛒 Cart / Keranjang Belanja

- **Global Cart State:** State keranjang dikelola secara terpusat menggunakan React Context (`StateContext`) dan tersinkronisasi otomatis secara berkala ke `localStorage`.
- **Add / Remove Toggle:** Tombol interaktif pada _product card_ yang memungkinkan pengguna menambah atau menghapus item dari keranjang dalam satu klik.
- **Cart Counter:** Jumlah total item unik dalam keranjang tersedia sebagai `cartCount` untuk ditampilkan sebagai _badge notification_ di navbar.
- **Cart Total:** Akumulasi total harga belanjaan dihitung secara otomatis menggunakan pendekatan _derived state_.

### 🔍 Filter & Pencarian

- **Category Select:** Dropdown combobox interaktif yang mendukung pencarian nama kategori, termasuk opsi default "Semua Kategori".
- **Search Input:** Field pencarian produk berbasis teks yang dilengkapi dengan tombol _clear_ sekali klik.
- **Filter Handler:** Fungsi `handleFilterChange` bertugas menyinkronkan filter kategori dan kata kunci pencarian langsung ke URL query params atau state aplikasi.

### 🌐 Halaman Explore

- **Hero Section:** Menampilkan headline utama, tagline, dan dua buah banner promo (promo harga khusus & gratis ongkir) sebelum memasuki grid produk.
- **Grid Produk:** Layout responsif yang beradaptasi menjadi 2 hingga 5 kolom bergantung pada _breakpoint_ layar pengguna, dilengkapi dengan _empty state_ visual jika produk tidak ditemukan.

### 🧾 Footer

- **Footer E-Commerce:** Navigasi bawah terstruktur dalam tiga kolom utama (Belanja, Bantuan, Akun) disertai dengan tagline brand, tombol login/logout, dan informasi _copyright_ (read-only).

### ⚙️ Admin Panel

#### 📊 Dashboard

- **Stat Cards:** Menampilkan ringkasan total produk, total pengguna, total pesanan, dan persentase konversi yang dilengkapi indikator tren naik/turun.
- **Order Status Summary:** Visualisasi _breakdown_ pesanan dengan status _pending_, selesai, dan dibatalkan (read-only).
- **Tabel Pesanan Terbaru:** Menampilkan 5 transaksi terakhir yang mencakup nama pelanggan, tanggal transaksi, total nominal, dan badge status berwarna dinamis (read-only).

#### 💬 Conversation (Live Chat)

- **User Chat List:** Mengelola daftar pengguna yang menginisiasi chat, dicatat berdasarkan email, jumlah pesan dikirim, tanggal pembuatan, serta status terakhir aktif.
- **Detail Conversation:** Menampilkan riwayat percakapan penuh secara kronologis antara _chatbot_ otomatis dengan pengguna.

#### 🛍️ Products Management

- **Product List & Filter:** Tabel produk yang mendukung pencarian nama, filter berdasarkan kategori, penyaringan tanggal dibuat, lengkap dengan sistem pagination dan limit data.
- **CRUD Product:** Fitur tambah, baca, ubah, dan hapus produk yang mendukung manajemen upload gambar, nama produk, relasi kategori (_foreign key_ ke tabel category), harga, stok, dan deskripsi.

#### 📂 Categories Management

- **Category List & Filter:** Tabel kategori yang mendukung pencarian nama, penyaringan tanggal dibuat, serta pagination dan limit data.
- **CRUD Category:** Fitur penuh manajemen kategori termasuk upload gambar cover, nama kategori, dan deskripsi penjelasan.

### 🎨 UI / UX & Responsivitas

- **Floating Chat Widget:** Tombol chat melayang dengan animasi halus menggunakan _Framer Motion_. Lebar widget adaptif terhadap perangkat mobile menggunakan formula CSS `min(360px, calc(100vw - 16px))`.
- **DetailItem Component:** Komponen modular (_reusable_) untuk menampilkan pasangan label-value, mendukung _status badge_ berwarna bawaan (default, error, warning, success, info).
- **Responsive Layout:** Implementasi penuh pendekatan _mobile-first_ menggunakan sistem _breakpoint_ Tailwind CSS (`sm`, `md`, `lg`).

---

## 🛠️ Fitur yang Belum Selesai (Roadmap Pengembangan)

### 🔄 Keranjang Belanja Dinamis (Dynamic Carting)

- **Deskripsi:** Saat ini, data keranjang belanja masih bersifat statis dan disimpan secara lokal di dalam `localStorage` browser pengguna.
- **Rencana Pengembangan:** Mengintegrasikan keranjang belanja langsung dengan database Supabase. Hal ini memungkinkan data keranjang tersinkronisasi secara _real-time_ lintas perangkat (multi-device) segera setelah pengguna melakukan autentikasi/login.

### 💳 Sistem Transaksi & Integrasi Payment Gateway

- **Deskripsi:** Modul checkout belum terhubung dengan sistem pemrosesan pembayaran eksternal.
- **Rencana Pengembangan:** Setelah sistem keranjang belanja dinamis berhasil diimplementasikan, fitur transaksi penuh akan dibangun. Langkah ini melibatkan pengiriman data _list products_ dari keranjang menuju platform _payment gateway_ resmi.
- **Target Integrasi:** Mendukung salah satu atau beberapa _payment gateway_ populer seperti **Midtrans, Stripe, Xendit, Doku, atau Faspay** untuk menangani metode pembayaran instan (Virtual Account, E-Wallet, Kartu Kredit, dll.).

---

## 🤖 AI Tools yang Digunakan

- **Claude (Anthropic):** Digunakan secara intensif sepanjang siklus pengembangan sebagai _pair programmer_ utama untuk:
  - Merancang arsitektur manajemen state pada fitur keranjang (kombinasi global state + sinkronisasi `localStorage`).
  - Mengoptimalkan nilai responsivitas layout serta standarisasi tipografi antarmuka.
  - Memproduksi kode _boilerplate_ query database Supabase untuk kebutuhan visualisasi komponen dashboard admin.
  - Menyusun alur logika _chatbot_ serta pemetaan integrasi tabel riwayat pesan ke dalam database Supabase secara bertahap.

---

## ⚖️ Tradeoff Teknis

| Keputusan                     | Pilihan yang Diambil                                 | Alasan / Rasionalisasi                                                                                                                                                             |
| :---------------------------- | :--------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cart storage**              | `localStorage` via `useEffect`                       | Sudah sangat memadai untuk kebutuhan validasi MVP (_Minimum Viable Product_); belum memerlukan beban baca/tulis ke backend server pada fase awal.                                  |
| **Cart state**                | React Context (`StateContext`)                       | Memanfaatkan arsitektur context yang sudah tersedia di aplikasi, menghindari penambahan _library dependency_ pihak ketiga seperti Zustand atau Redux.                              |
| **`cartTotal` & `cartCount`** | Derived state langsung dari array `cart[]`           | Mencegah terjadinya bug _out-of-sync_ (ketidaksesuaian data) yang sering terjadi jika total dan jumlah item disimpan pada state terpisah.                                          |
| **Dashboard data**            | `Promise.all` parallel fetch                         | Mempercepat waktu pemuatan halaman (_loading time_) melalui eksekusi fetch data secara paralel pada Server Component Next.js, menghindari fenomena _sequential waterfall request_. |
| **Chat widget width**         | CSS `min()` pada inline `style` prop                 | Pustaka _Framer Motion_ tidak mendukung ekspresi fungsi dinamis CSS seperti `min()` secara native di dalam properti properti `animate`.                                            |
| **Category default**          | Penambahan item "Semua Kategori" secara manual di UI | Menghindari modifikasi skema tabel database utama atau manipulasi payload API hanya untuk kebutuhan representasi visual filter.                                                    |
| **Image fallback**            | `/images/default-img.png` via operator `??`          | Implementasi penanganan error gambar yang praktis, ringan, dan tidak membutuhkan arsitektur _error boundary_ komponen yang kompleks.                                               |

## 📝 Pertanyaan Refleksi

### 1. Mengapa Anda memilih tantangan ini?

**Jawaban:** Karena sebelumnya saya sudah pernah membuat _chatbot_ yang terintegrasi dengan LLM (_Large Language Model_), sehingga saya sudah lebih memahami alur pengerjaan, arsitektur data, dan logika integrasinya.

### 2. Bagian mana yang paling sulit?

**Jawaban:** Bagian yang paling menantang adalah menyimpan riwayat pesan ke database secara efisien, lalu mengintegrasikannya dengan manajemen _session_. Tantangannya terletak pada sinkronisasi data agar riwayat pesan tersebut dapat ditampilkan kembali pada UI chat pengguna dengan lancar, sekaligus bisa ditarik ke dalam Admin Panel secara akurat untuk kebutuhan monitoring data percakapan.

### 3. Apabila diberikan tambahan waktu satu hari, bagian mana yang akan Anda perbaiki?

**Jawaban:** Saya akan fokus menambahkan fitur transaksi (_checkout_) dan memperbarui sistem _carting_. Saat ini fitur keranjang belanja sudah berjalan namun datanya masih statis (disimpan di `localStorage`). Dengan tambahan waktu, saya akan mengubah arsitektur _cart_ menjadi dinamis (tersinkronisasi dengan database Supabase). Jika data _cart_ sudah dinamis, proses integrasi data produk ke platform _payment gateway_ seperti Midtrans, Xendit, atau Doku akan menjadi jauh lebih mudah dan aman.

### 4. Bagaimana cara Anda melakukan scaling terhadap aplikasi ini apabila jumlah pengguna bertambah?

**Jawaban:** Untuk melakukan _scaling_ pada aplikasi berbasis Next.js dan Supabase ini, strategi yang akan saya terapkan meliputi:

- **Optimasi Frontend & Caching:** Memanfaatkan fitur _Incremental Static Regeneration (ISR)_ di Next.js untuk halaman produk dan kategori. Dengan begitu, halaman dapat di-_cache_ di level CDN (misalnya via Vercel) untuk mengurangi beban langsung ke database saat terjadi lonjakan pengunjung.
- **Database Indexing & Connection Pooling:** Menambahkan database _index_ pada kolom yang sering diakses (seperti pencarian nama produk, kategori, dan email pada tabel chat). Saya juga akan memanfaatkan _Connection Pooler_ bawaan Supabase (Supavisor) untuk mengelola ribuan koneksi database konkuren dari pengguna secara efisien.
- **Arsitektur Real-time yang Terfilter:** Pada fitur _live chat_, memastikan performa tetap terjaga dengan menerapkan filter _channel_ yang ketat pada Supabase Realtime serta mengaktifkan _Row Level Security (RLS)_, sehingga server tidak melakukan _broadcast_ data yang tidak perlu ke pengguna lain.
- **Pemisahan Media Storage:** Memastikan semua gambar produk dan aset visual menggunakan Supabase Storage yang terhubung dengan CDN, serta mengoptimalkannya menggunakan komponen `<Image />` dari Next.js untuk menghemat bandwidth server.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
