# Examples — Fast Understanding Without Lost Precision

Illustrative **response patterns**, not user facts or executed evidence. These examples must not override the shared communication policy. Use the style that best fits the question.

## A. Simple yes/no (no diagram)

**Question:** Apakah pengujian lokal sudah dilakukan?

**Bad:** "Berdasarkan tahapan implementasi dan mekanisme pengembangan yang sudah kita susun, proses pengujian lokal masih menjadi sebuah agenda yang direncanakan dalam fase berikutnya ..."

**Better:** "Belum. Source sudah diperiksa, tetapi pengujian di PC belum dilakukan."

## B. Complex workflow (small diagram)

**Question:** Bagaimana alur pekerjaan dari ChatGPT sampai PC lokal?

**Bad:** Six paragraphs of architecture names, test engines, branches and runner details.

**Better:**

```text
ChatGPT + GitHub
   ↓
Selesaikan arsitektur & source
   ↓
Paket siap uji (belum dites)
   ↓
PC + AI agent
   ↓
Localtest & perbaikan
```

"Di ChatGPT kita selesaikan source. Setelah Anda memilih tahap lokal, agent di PC menjalankan pengujian. GitHub Actions tidak dipakai sebagai pengganti."

## C. Repository update (result first)

**Question:** Apa hasil perbaikannya?

**Bad:** Lead with a long 20-file list, architecture terms and repeated disclaimers.

**Better:** "Aturan inti sudah dirapikan dan disimpan di branch yang disetujui. Alur kerja sekarang memakai satu pemilik keputusan. Pengujian lokal belum dilakukan. [Repository link when available]."

## D. Explicit expert request (retain requested details)

**Question:** Berikan perubahan kontrak API, contoh kode dan risiko migrasi.

**Better:** "Ringkasan keputusan" first, then the requested precise schema/code, edge cases, migration steps and matched evidence. Do **not** cut technical content just to satisfy an arbitrary word cap.

## E. No invented measurements

**Question:** Apakah standar ini memang menghemat 60% waktu baca?

**Better:** "Belum bisa dipastikan. Kita sudah menyederhanakan format jawaban, tetapi penghematan waktu baca harus diuji dengan pengguna."

**Non-goal:** these examples do not create a new reply templating engine or force every ChatGPT response to have a title, table and diagram.
