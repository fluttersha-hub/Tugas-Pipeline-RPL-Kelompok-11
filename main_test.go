package main

import (
	"encoding/json"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestPasswordHash(t *testing.T) {
	hash := hashPassword("contoh-kata-sandi")
	if !verifyPassword(hash, "contoh-kata-sandi") {
		t.Fatal("kata sandi yang benar tidak diterima")
	}
	if verifyPassword(hash, "kata-sandi-lain") {
		t.Fatal("kata sandi yang salah diterima")
	}
}

func TestAllServicesHaveUniqueCodes(t *testing.T) {
	if len(services) != 30 {
		t.Fatalf("jumlah jenis surat = %d, ingin 30", len(services))
	}
	seen := make(map[string]bool, len(services))
	for _, service := range services {
		if service.Code == "" || service.Name == "" || len(service.Fields) == 0 {
			t.Errorf("spesifikasi layanan tidak lengkap: %#v", service)
		}
		if seen[service.Code] {
			t.Errorf("kode layanan duplikat: %s", service.Code)
		}
		seen[service.Code] = true
	}
	if len(complaintCategories) != 12 {
		t.Fatalf("jumlah kategori aduan = %d, ingin 12", len(complaintCategories))
	}
}

func TestStorePersistsUpdates(t *testing.T) {
	path := filepath.Join(t.TempDir(), "state", "data.json")
	store, err := openStore(path)
	if err != nil {
		t.Fatal(err)
	}
	user := User{ID: "warga-1", Email: "warga@example.test", Role: "warga", CreatedAt: time.Now()}
	if err := store.update(func(db *database) error {
		db.Users[user.ID] = user
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	reloaded, err := openStore(path)
	if err != nil {
		t.Fatal(err)
	}
	if got := reloaded.snapshot().Users[user.ID]; got.Email != user.Email {
		t.Fatalf("pengguna tidak tersimpan: %#v", got)
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	var decoded database
	if err := json.Unmarshal(raw, &decoded); err != nil {
		t.Fatalf("berkas data tidak valid JSON: %v", err)
	}
}

func TestSessionSignatureAndExpiration(t *testing.T) {
	store, err := openStore(filepath.Join(t.TempDir(), "data.json"))
	if err != nil {
		t.Fatal(err)
	}
	user := User{ID: "citizen-1", Email: "warga@example.test", Role: "warga", AccountStatus: "aktif"}
	if err := store.update(func(db *database) error {
		db.Users[user.ID] = user
		return nil
	}); err != nil {
		t.Fatal(err)
	}
	app := &App{store: store, secret: []byte("test-secret")}
	response := httptest.NewRecorder()
	if err := app.setSession(response, user.ID); err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest("GET", "/dashboard", nil)
	request.AddCookie(response.Result().Cookies()[0])
	if got := app.currentUser(request); got == nil || got.ID != user.ID {
		t.Fatal("sesi valid tidak ditemukan")
	}
	request.Header.Set("Cookie", sessionName+"=tampered.signature")
	if got := app.currentUser(request); got != nil {
		t.Fatal("sesi dengan tanda tangan tidak valid diterima")
	}
}
