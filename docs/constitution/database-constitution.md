# CGG HDOS Database Constitution

**Version:** 1.0

**Status:** Locked

## Tujuan

Database HDOS merupakan fondasi permanen sistem. Semua engine wajib mengikuti konstitusi ini agar kompatibilitas jangka panjang tetap terjaga.

## Object Store Permanen

| Store       | Fungsi             |
| ----------- | ------------------ |
| config      | Konfigurasi sistem |
| systemlog   | Audit internal     |
| queue       | Universal Queue    |
| hazard      | Data Hazard        |
| inspection  | Data Inspection    |
| incident    | Data Incident      |
| audit       | Data Audit         |
| environment | Data Environment   |

## Aturan Permanen

1. Tidak boleh menghapus object store yang sudah dipublikasikan.
2. Tidak boleh mengubah `keyPath` object store yang sudah ada.
3. Penambahan object store harus menaikkan `DB_VERSION`.
4. Penambahan index diperbolehkan melalui proses migrasi.
5. Semua migrasi wajib kompatibel dengan database lama.

## Riwayat Migrasi

| DB Version | Perubahan       |
| ---------- | --------------- |
| 1          | Database dasar  |
| 2          | Config Store    |
| 3          | System Log      |
| 4          | Universal Queue |

## Prinsip

* Offline First
* Backward Compatible
* Zero Data Loss
* Engine First, Feature Later
* Single Source of Truth (Google Spreadsheet)
