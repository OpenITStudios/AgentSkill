# Metode Engineering AI — Pedoman Singkat

**Delapan metode, satu pemilik pekerjaan.** Ketika mengubah kode, gunakan **Karpathy + Ponytail dalam satu pemeriksaan**. Enam metode lainnya dipilih hanya jika benar-benar dibutuhkan.

```text
Permintaan pengguna
        ↓
Tentukan pemilik source dan izin
        ↓
Perubahan kode? Karpathy + Ponytail (satu pemeriksaan)
        ↓
Ada masalah khusus? Pilih satu metode pendukung
        ↓
Perbaiki source → Periksa bukti yang tersedia → STOP
```

| Metode | Dipakai untuk | Tidak perlu ketika |
| --- | --- | --- |
| **Karpathy + Ponytail** | Perubahan kode paling sederhana **namun tetap lengkap dan aman** | Tanya jawab biasa |
| **Pstack / Poteto** | Bug sulit, arsitektur, insiden atau performa | Perbaikan kecil yang sudah jelas |
| **Harness²** | Membandingkan kualitas aturan AI dengan pengujian yang diizinkan | Pengembangan biasa |
| **DeepSeek Harness** | Desain tool, sesi, pemulihan dan izin | Tidak ada masalah pada tool/sesi |
| **REA** | Investigasi file/aplikasi tertutup yang sah dan memiliki tool | Source sudah tersedia |
| **UI UX Pro Max** | Tampilan, navigasi, aksesibilitas dan interaksi | Pekerjaan backend |
| **Matt Pocock** | Istilah domain, modul rumit, diagnosis dan review Standar+Tujuan | Perubahan sederhana |

**Rujukan kanonis:** [registry/methods.json](../../registry/methods.json) memuat kondisi aktivasi, kondisi penolakan, langkah kerja, pembatasan, sumber yang dipin, dan kasus evaluasi. Saat standar dipasang ke suatu repository, salinan identik bernama `.agent-standard/methods.json` digunakan.

Metode adalah **cara kerja**, bukan agent atau plugin baru. Detail khusus Minecraft, Blockbench, UI dan proyek lainnya tetap dimiliki skill repository masing-masing.

**Batas pengujian:** Dalam ChatGPT + GitHub, selesaikan source dan pemeriksaan source. Tidak meminta localtest atau menjalankan GitHub Actions/cloud. Pengukuran efektivitas metode memerlukan pengujian agent nyata yang diizinkan kemudian.
