## Otomasi Continuous Integration (CI)

Proyek **SI-LAYANG** menerapkan *pipeline* Continuous Integration (CI) menggunakan **GitHub Actions** melalui berkas konfigurasi `.github/workflows/ci.yml` (`CI – SI-LAYANG`). *Pipeline* ini bertugas memverifikasi kompilasi kode, standar format, serta pengujian otomatis sebelum perubahan digabungkan ke *branch* `main`[cite: 1].

### 1. Pemicu (*Trigger*) Pipeline
* **Push:** Berjalan otomatis setiap terdapat *commit* baru pada *branch* `main`, `ci/**`, `test/**`, atau `docs/**`[cite: 1].
* **Pull Request:** Berjalan otomatis setiap terdapat pengajuan *Pull Request* menuju *branch* `main`[cite: 1].

### 2. Tahapan Eksekusi (*Jobs*)
*Pipeline* menjalankan dua *job* secara paralel pada lingkungan `ubuntu-latest` dengan versi Go yang dibaca otomatis dari `go.mod`:
1. **Build & Test:**
   * Memverifikasi integritas modul Go (`go mod verify`).
   * Mengompilasi seluruh paket aplikasi (`go build -v ./...`)[cite: 1].
   * Menjalankan seluruh pengujian otomatis pada `main_test.go` beserta deteksi *race condition* dan perhitungan cakupan kode (`go test -v -race -coverprofile=coverage.out ./...`)[cite: 1].
   * Menampilkan ringkasan *coverage* (`go tool cover -func=coverage.out`) dan mengunggah berkas `coverage.out` sebagai *artifact* (`coverage-report`).
2. **Lint:**
   * Memeriksa potensi kesalahan statis pada kode (`go vet ./...`).
   * Memastikan seluruh berkas `.go` mengikuti standar format resmi Go (`gofmt -l .`).

### 3. Cara Menjalankan Pengujian CI Secara Lokal
Sebelum melakukan `push` atau membuka *Pull Request*, pengujian yang sama dapat dijalankan secara lokal pada direktori utama proyek (pastikan **Go 1.22+** sudah terpasang):

```bash
# 1. Verifikasi dependensi & kompilasi aplikasi
go mod verify
go build -v ./...

# 2. Pemeriksaan format kode dan analisis statis (Lint)
gofmt -l .
go vet ./...

# 3. Menjalankan seluruh pengujian otomatis (Linux / macOS)
go test -v -race -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
```

## Pembagian Peran & Pengerjaan Tim (Kelompok 11)

Berikut adalah pembagian tugas dan kontribusi masing-masing anggota kelompok dalam pengerjaan *pipeline* Continuous Integration (CI). **Seluruh anggota tim turut berkolaborasi bersama dalam menyusun dan melengkapi dokumentasi `README.md`:**

| No | Nama Anggota | NIM | Peran | Branch Kerja | Detail Pengerjaan & Hasil |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Amisha** | `F5512510003` | **CI Engineer & Incident Simulation** | `ci/setup-workflow`, `test/simulasi-ci`, `docs/readme-ci` | Menyusun konfigurasi `.github/workflows/ci.yml` (*trigger*, *job* `Build & Test`, dan `Lint`), melakukan simulasi *run* gagal (*Test Fail*), serta ikut menyusun `README.md`. |
| 2 | **Moh. Akbar Nusantara** | `F5512520037` | **Project Developer & Incident Resolution** | `main`, `test/simulasi-ci`, `docs/readme-ci` | Mengembangkan proyek aplikasi SI-LAYANG beserta pengujian pada `main_test.go`, memperbaiki kode pada simulasi yang gagal hingga *pipeline* sukses, serta ikut menyusun `README.md`. |
| 3 | **Muh. Aqsha Syahrir** | `F5512510033` | **Documentation & Final Report** | `docs/readme-ci` | Menyusun laporan akhir pengumpulan tugas (ringkasan error, langkah perbaikan, dan kompilasi bukti *run* CI), serta ikut menyusun `README.md`. |