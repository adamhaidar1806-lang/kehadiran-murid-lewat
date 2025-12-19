# Sistem Kehadiran Lewat - Panduan Penyediaan Tempatan

## Keperluan Sistem
- Python 3.11 atau lebih tinggi
- PostgreSQL (atau gunakan SQLite untuk pengujian)
- Windows

## Langkah-Langkah Pemasangan

### 1. Menyediakan Database
Sebelum menjalankan aplikasi, anda perlu menyediakan pangkalan data:

**Pilihan A: PostgreSQL (Disyorkan)**
```
1. Pasang PostgreSQL dari https://www.postgresql.org/download/windows/
2. Buat pangkalan data baru
3. Nota nama pengguna, kata laluan, dan nama pangkalan data
```

**Pilihan B: SQLite (Untuk Pengujian)**
Aplikasi akan secara automatik membuat fail SQLite jika DATABASE_URL tidak ditentukan.

### 2. Menyediakan Pemboleh Ubah Persekitaran
1. Salin fail `.env.example` menjadi `.env`
2. Sunting fail `.env` dan isi maklumat database anda:
```
DATABASE_URL=postgresql://username:password@localhost:5432/nama_database
```

### 3. Menjalankan Aplikasi
**Mudah:** Hanya klik dua kali pada `run.bat`

Atau jalankan secara manual:
```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 4. Akses Aplikasi
Buka pelayar web dan pergi ke: **http://localhost:5000**

## Akaun Lalai

**Admin:**
- Username: `admin`
- Kata laluan: `skuses7620`

**Guru:**
- Username: `guru`
- Kata laluan: `smkserikundang7620`

## Pemecahan Masalah

**Error: "psycopg2" atau "PostgreSQL" error**
- Pastikan PostgreSQL sudah dipasang dan berjalan
- Periksa tetapan DATABASE_URL dalam fail `.env`

**Error: "Module not found"**
- Pastikan fail `requirements.txt` semua telah dipasang
- Cuba jalankan: `pip install -r requirements.txt` sekali lagi

**Port 5000 sudah digunakan**
- Sunting fail `app.py` dan tukar port:
```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Tukar 5000 ke 5001
```

## Struktur Fail

```
sistemkehadiran/
├── app.py                 # Fail aplikasi utama
├── models.py              # Model pangkalan data
├── requirements.txt       # Kebergantungan Python
├── run.bat               # Skrip untuk menjalankan di Windows
├── .env                  # Pemboleh ubah persekitaran (buat dari .env.example)
├── static/               # CSS, JavaScript
│   ├── css/
│   └── js/
└── templates/            # Fail HTML
    ├── base.html
    ├── index.html
    ├── dashboard_*.html
    └── error.html
```

## Maklumat Lanjut

Untuk soalan atau masalah, sila hubungi pentadbir sistem.
