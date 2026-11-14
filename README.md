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

Database baru akan dibuat dengan akun demo berikut (kata sandi: `silayang123`):

| Peran | Email |
| --- | --- |
| Warga | `warga@silayang.local` |
| Staf verifikator | `staf@silayang.local` |
| Lurah | `lurah@silayang.local` |

Setiap kelurahan pada data wilayah juga mendapatkan satu akun staf dan satu akun lurah. Format emailnya `staf.<kecamatan>-<kelurahan>@silayang.local` dan `lurah.<kecamatan>-<kelurahan>@silayang.local`, menggunakan nama wilayah huruf kecil dengan spasi menjadi tanda hubung. Contoh untuk Tondo: `staf.mantikulore-tondo@silayang.local` dan `lurah.mantikulore-tondo@silayang.local`. Password awal semua akun wilayah adalah `silayang123`. Akun demo staf/lurah lama dibatasi ke Kelurahan Talise.

Pendaftaran warga baru berstatus menunggu verifikasi. Akun warga aktif dapat mengajukan satu dari 30 jenis surat, melaporkan aduan dalam 12 kategori, dan melacak status dengan kode permohonan. Staf dapat memverifikasi akun, memeriksa surat, membuat draft bernomor, dan menanggapi aduan. Lurah dapat menyetujui draft dan memperbarui tindak lanjut aduan.

Saat mendaftar, warga memilih kecamatan dan kelurahan domisili. Daftar verifikasi warga, tindakan setuju/tolak, dan akses foto KTP staf dibatasi ke domisili yang sama; inbox surat, tindakan verifikasi surat, dokumen, dan lampiran surat staf/lurah juga dibatasi ke kelurahan akun. Akun lama hanya dipetakan otomatis jika alamatnya menyebut kelurahan secara eksplisit; akun tanpa wilayah tidak ditampilkan dalam daftar verifikasi. Password bersama hanya untuk demonstrasi lokal dan harus diganti sebelum deployment nyata.

## Pratinjau draf surat

Warga aktif memilih kecamatan dan kelurahan terlebih dahulu, lalu dapat melihat pratinjau surat tanpa mengirim permohonan. Daftar wilayah, nama kantor, alamat kantor, dan nama lurah mengikuti data pada spreadsheet daftar kelurahan yang disediakan; alamat dan email Tondo mengikuti rincian pada spesifikasi kop terbaru. Kop menampilkan lambang Kota Palu di kiri, teks yang tepat di tengah, dan garis pemisah ganda. Isi draf bersifat read-only; tombol **Unduh PDF** membuka dialog cetak browser. Jika pekerjaan belum tersedia, warga diminta mengisinya sebelum pratinjau dibuat.

Endpoint `POST /api/v1/letters/draft-preview` menerima JSON `user_id`, `jenis_surat_id` (kode layanan), dan `data_tambahan`. Identitas diambil dari sesi warga yang terverifikasi, bukan dari nilai identitas kiriman klien. Nomor surat sengaja kosong sampai staf memproses permohonan. Nama lurah berasal dari data wilayah spreadsheet; NIP pada pratinjau adalah nilai dummy dan bukan identitas resmi. Spreadsheet saat ini mencantumkan 32 kantor di 6 kecamatan.

## Batasan dan keamanan deployment

- Blok tanda tangan pada dokumen hanya tampilan. QR dan NIP adalah dummy; tidak ada kode verifikasi atau tanda tangan elektronik resmi. Surat dapat dicetak atau disimpan sebagai PDF melalui dialog cetak browser.
- Notifikasi WhatsApp/email dan ekspor laporan belum tersambung ke penyedia eksternal.
- Akun demo, secret default, server HTTP, dan penyimpanan JSON lokal hanya untuk demonstrasi/pengembangan. Sebelum digunakan untuk layanan nyata, konfigurasi secret acak, HTTPS, backup dan database produksi, kebijakan retensi/akses data, integrasi TTE resmi, serta kanal notifikasi.
- Berkas unggahan dibatasi 5 MB dan hanya dapat diakses oleh pemilik serta petugas yang berwenang.

## Pengujian

```powershell
go test ./...
```
