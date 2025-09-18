# Email Configuration Setup

Aplikasi ini menggunakan nodemailer untuk mengirim email dari form kontak. Berikut adalah langkah-langkah untuk mengonfigurasi email:

## 1. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Kemudian edit file `.env` dan isi dengan kredensial email Anda:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=info@royalweddingully.com
PORT=3000
```

## 2. Setup Gmail App Password (Jika menggunakan Gmail)

1. Buka [Google Account Settings](https://myaccount.google.com/)
2. Pilih "Security" di sidebar kiri
3. Aktifkan "2-Step Verification" jika belum aktif
4. Setelah 2-Step Verification aktif, cari "App passwords"
5. Generate app password untuk "Mail"
6. Gunakan app password ini sebagai `EMAIL_PASS` di file `.env`

## 3. Konfigurasi Email Service Lain

Jika tidak menggunakan Gmail, Anda bisa mengubah konfigurasi di `src/controllers/mainController.js`:

```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.youremailservice.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
```

## 4. Testing

Setelah konfigurasi selesai, jalankan server dan test form kontak:

```bash
npm run dev:server
```

Buka http://localhost:3000 dan coba kirim pesan melalui form kontak.

## 5. Validasi Form

Sistem akan memvalidasi:
- Nama minimal 2 karakter
- Format email yang valid
- Nomor telepon yang valid
- Pesan minimal 10 karakter

## 6. Error Handling

Sistem akan memberikan response yang sesuai:
- Success: `{ success: true, message: "Pesan berhasil dikirim!" }`
- Validation Error: `{ success: false, message: "Data tidak valid", errors: [...] }`
- Server Error: `{ success: false, message: "Gagal mengirim pesan..." }`