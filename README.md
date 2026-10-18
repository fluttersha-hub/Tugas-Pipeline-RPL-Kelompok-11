# SILAYANG

Portal layanan warga dan administrasi kelurahan berbasis Go. Aplikasi ini menggunakan `net/http`, HTML template, dan penyimpanan JSON lokal sehingga dapat dijalankan tanpa mengunduh dependensi Go tambahan.

## Menjalankan aplikasi

```powershell
go run .
```

Buka `http://localhost:8080`. Data tersimpan di `data/silayang.json`, sedangkan berkas yang diunggah tersimpan di folder `uploads`.

Pengaturan opsional melalui environment:

| Variabel | Default | Kegunaan |
| --- | --- | --- |
| `SILAYANG_ADDR` | `:8080` | Alamat dan port HTTP |
| `SILAYANG_DATA` | `data/silayang.json` | Lokasi penyimpanan data |
| `SILAYANG_UPLOADS` | `uploads` | Lokasi penyimpanan berkas |
| `SILAYANG_SECRET` | rahasia development | Kunci penandatanganan cookie sesi |
| `SILAYANG_COOKIE_SECURE` | `false` | Setel `true` saat layanan diakses melalui HTTPS |

## Akun demo

Database baru akan dibuat dengan akun berikut (kata sandi semua akun: `silayang123`):

| Peran | Email |
| --- | --- |
| Warga | `warga@silayang.local` |
| Staf verifikator | `staf@silayang.local` |
| Lurah | `lurah@silayang.local` |

Pendaftaran warga baru berstatus menunggu verifikasi. Akun warga aktif dapat mengajukan satu dari 30 jenis surat, melaporkan aduan dalam 12 kategori, dan melacak status dengan kode permohonan. Staf dapat memverifikasi akun, memeriksa surat, membuat draft bernomor, dan menanggapi aduan. Lurah dapat menyetujui draft dan memperbarui tindak lanjut aduan.

## Batasan dan keamanan deployment

- TTE dan kode verifikasi dokumen pada versi ini adalah **simulasi**, bukan tanda tangan elektronik tersertifikasi. Surat dapat dicetak atau disimpan sebagai PDF melalui dialog cetak browser.
- Notifikasi WhatsApp/email dan ekspor laporan belum tersambung ke penyedia eksternal.
- Akun demo, secret default, server HTTP, dan penyimpanan JSON lokal hanya untuk demonstrasi/pengembangan. Sebelum digunakan untuk layanan nyata, konfigurasi secret acak, HTTPS, backup dan database produksi, kebijakan retensi/akses data, integrasi TTE resmi, serta kanal notifikasi.
- Berkas unggahan dibatasi 5 MB dan hanya dapat diakses oleh pemilik serta petugas yang berwenang.

## Pengujian

```powershell
go test ./...
```
