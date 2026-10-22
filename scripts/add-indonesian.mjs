// Fills in the Indonesian versions ("...Id" fields) of the existing content,
// drafted by Claude for you to check in the Studio.
// Run with: npm run add-indonesian
//
// Safe to run again: it only fills Indonesian fields that are still empty
// (setIfMissing), never changes English text and never overwrites your edits.
// Unpublished drafts get the same texts, so nothing is lost when you publish.

import { createClient } from "@sanity/client";

const { NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN } = process.env;

if (!NEXT_PUBLIC_SANITY_PROJECT_ID || !NEXT_PUBLIC_SANITY_DATASET || !SANITY_API_WRITE_TOKEN) {
  console.error("Missing Sanity values in .env.local (see .env.example).");
  process.exit(1);
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: NEXT_PUBLIC_SANITY_DATASET,
  token: SANITY_API_WRITE_TOKEN,
  apiVersion: "2026-03-01",
  useCdn: false,
});

// Path helpers for items inside lists (found by their _key).
const block = (key, field) => `content[_key=="${key}"].${field}`;
const inBlock = (key, list, itemKey, field) => `content[_key=="${key}"].${list}[_key=="${itemKey}"].${field}`;
const fact = (key, field) => `facts[_key=="${key}"].${field}`;

// Document id → { field path: Indonesian text }.
// Texts that are the same in both languages (names, "Waterfall") are left out:
// an empty Indonesian field shows the English text.
const TRANSLATIONS = {
  siteSettings: {
    headlineId: "Sarjana Sistem Informasi",
    taglineId: "Merancang produk digital yang jelas, mudah digunakan, dan berorientasi konversi.",
    availabilityLabelId: "Terbuka untuk Peluang Kerja Penuh Waktu",
    aboutHeadingId: "Tentang Saya",
    aboutTextId:
      "Halo, saya Alif, lulusan Sistem Informasi Universitas Hasanuddin yang merancang website dan aplikasi yang langsung dipahami penggunanya sejak pertama kali dilihat.\n\n" +
      "Bagi saya, sistem di balik sebuah produk sama pentingnya dengan tampilan di layar. Sebelum membuka Figma, saya menganalisis alur kerja, mengumpulkan kebutuhan pengguna, dan merancang alur sistem. Setelah itu saya membuat prototipe, mengujinya, dan menyempurnakannya hingga benar-benar berfungsi.",
    ctaHeadingId: "Punya ide proyek?",
    ctaTextId:
      "Bersama, kita bisa menciptakan sesuatu yang jelas dan berdampak. Mari berkolaborasi mewujudkan ide kita dengan cara yang bermakna bagi semua orang.",
    siteTitleId: "Alif Rezky Maulana — Portofolio",
    siteDescriptionId:
      "Portofolio Alif Rezky Maulana, lulusan Sistem Informasi Universitas Hasanuddin. Desain UI/UX dan pengembangan web untuk produk digital yang jelas dan mudah digunakan.",
  },

  // Services
  "service-ui-ux-design": {
    titleId: "Desain UI/UX",
    descriptionId:
      "Saya merancang pengalaman digital yang intuitif melalui Design Thinking, mulai dari memahami kebutuhan pengguna hingga wireframe dan prototipe teruji di Figma.",
  },
  "service-graphic-design": {
    titleId: "Desain Grafis",
    descriptionId:
      "Saya membuat konten visual untuk media digital dan cetak, dari aset media sosial hingga editing foto, dengan tetap konsisten pada identitas brand.",
  },
  "service-web-design-dev": {
    titleId: "Desain & Pengembangan Web",
    descriptionId: "Saya merancang dan membangun website serta aplikasi web yang responsif dengan antarmuka yang bersih.",
  },
  "ce8d352d-8fde-44f3-9607-d7374637a529": {
    titleId: "Analisis & Perancangan Sistem",
    descriptionId:
      "Saya menerjemahkan proses bisnis dan kebutuhan pengguna menjadi rancangan sistem yang jelas, mulai dari flowchart dan use case hingga struktur database.",
  },

  // Skill groups
  "skill-business-process": {
    titleId: "ANALISIS & PERANCANGAN SISTEM",
    itemsId: ["Pemetaan Proses Bisnis", "Analisis Kebutuhan Pengguna", "Flowchart, Use Case, DFD, & ERD", "Perancangan Database"],
  },
  "skill-design-methodology": {
    titleId: "DESAIN UI/UX & VISUAL",
    itemsId: ["Design Thinking", "Wireframing & Prototyping", "Usability Testing", "Desain Grafis & Editing Foto"],
  },
  "skill-programming-tools": {
    titleId: "PENGEMBANGAN WEB",
    itemsId: [
      "Saya memiliki pemahaman dasar tentang JavaScript, Python, PHP, HTML, CSS, dan SQL yang diperoleh melalui pembelajaran dan proyek perkuliahan.",
    ],
  },
  "959c7fdf-604d-4200-953c-929f7eb60de5": {
    titleId: "DATA & PRODUKTIVITAS",
    itemsId: [
      "Visualisasi Data (Tableau, Power BI)",
      "Ms. Office & Google Workspace",
      "Alur Kerja Berbantuan AI (ChatGPT, Claude, Gemini)",
    ],
  },

  // Projects
  "project-skripsi-jkn-newborn": {
    titleId: "Sistem Registrasi JKN Bayi Baru Lahir",
    tagsId: ["Aplikasi Web", "Skripsi"],
    shortDescriptionId:
      "Sistem informasi berbasis web yang menyatukan administrasi kelahiran antara fasilitas kesehatan, Dukcapil, dan BPJS Kesehatan dalam satu platform.",
    [fact("fact1", "labelId")]: "Peran",
    [fact("fact1", "valueId")]: "Penulis & Developer",
    [fact("fact2", "labelId")]: "Studi kasus",
    [fact("fact4", "labelId")]: "Metode",
    [block("block1", "headingId")]: "Gambaran Umum",
    [block("block1", "bodyId")]:
      "Skripsi saya. Saya merancang dan membangun sistem informasi berbasis web untuk proses administrasi kelahiran dalam penerbitan kepesertaan JKN bagi bayi baru lahir, dengan BPJS Kesehatan Kota Makassar sebagai studi kasus.\n\n" +
      "Judul skripsi: Rancang Bangun Sistem Informasi Layanan Administrasi Kelahiran untuk Penerbitan Kepesertaan JKN Bayi Baru Lahir Berbasis Web (Studi Kasus: BPJS Kesehatan Kota Makassar).",
    [inBlock("block2", "items", "stat1", "labelId")]: "Tingkat keberhasilan pengujian",
    [inBlock("block2", "items", "stat2", "labelId")]: "Skenario uji black box",
    [inBlock("block2", "items", "stat3", "labelId")]: "Instansi dalam satu platform",
    [block("block3", "headingId")]: "Latar Belakang",
    [block("block3", "pointsId")]: [
      "Berdasarkan Peraturan Presiden (Perpres) No. 82 Tahun 2018, pendaftaran JKN bayi baru lahir melibatkan tiga instansi: fasilitas kesehatan (Faskes), Dinas Kependudukan dan Pencatatan Sipil (Dukcapil), dan BPJS Kesehatan.",
      "Administrasi antarinstansi tersebut masih dilakukan secara manual dan terpisah.",
      "Hal ini dapat menyebabkan keterlambatan, kesalahan pencatatan, dan dokumen yang tidak lengkap, sehingga layanan menjadi kurang efisien.",
    ],
    [block("block4", "headingId")]: "Masalah & Solusi",
    [inBlock("block4", "items", "pair1", "problemId")]:
      "Faskes, Dukcapil, dan BPJS Kesehatan menangani pendaftaran bayi baru lahir secara manual dan terpisah, sehingga berisiko terjadi keterlambatan, kesalahan pencatatan, dan dokumen yang tidak lengkap.",
    [inBlock("block4", "items", "pair1", "solutionId")]:
      "Sistem informasi berbasis web yang mengintegrasikan proses administrasi ketiga instansi dalam satu platform.",
    [block("block5", "headingId")]: "Proses",
    [block("block5", "introId")]: "Sistem dibangun dengan metode Waterfall, tahap demi tahap.",
    [inBlock("block5", "steps", "step1", "titleId")]: "Wawancara",
    [inBlock("block5", "steps", "step1", "descriptionId")]:
      "Wawancara dengan Kepala Bagian Kepesertaan BPJS Kesehatan Kota Makassar.",
    [inBlock("block5", "steps", "step2", "titleId")]: "Analisis kebutuhan sistem",
    [inBlock("block5", "steps", "step2", "descriptionId")]: "Mengidentifikasi kebutuhan sistem berdasarkan hasil wawancara.",
    [inBlock("block5", "steps", "step3", "titleId")]: "Perancangan sistem",
    [inBlock("block5", "steps", "step3", "descriptionId")]: "Pemodelan sistem, database, dan antarmuka pengguna.",
    [inBlock("block5", "steps", "step4", "titleId")]: "Implementasi",
    [inBlock("block5", "steps", "step4", "descriptionId")]: "Dibangun dengan Next.js dan Supabase.",
    [inBlock("block5", "steps", "step5", "titleId")]: "Pengujian",
    [inBlock("block5", "steps", "step5", "descriptionId")]: "Black box testing dengan lebih dari 50 skenario uji.",
    [block("block6", "headingId")]: "Hasil",
    [block("block6", "bodyId")]:
      "Sistem berhasil dirancang dan dibangun, serta mendukung proses administrasi kelahiran secara terintegrasi. Seluruh 50+ skenario uji black box berhasil dilalui (tingkat keberhasilan 100%).",
  },

  "project-desa-tanakaraeng-website": {
    titleId: "Website Desa Tanakaraeng",
    tagsId: ["Aplikasi Web", "Pengabdian Masyarakat"],
    shortDescriptionId:
      "Website resmi pertama Desa Tanakaraeng, Gowa: profil desa, infografis kependudukan, UMKM, berita, dan formulir pengaduan online, yang dikelola langsung oleh perangkat desa melalui dashboard admin.",
    timelineId: "Jul – Agu 2025",
    [fact("fact1", "labelId")]: "Peran",
    [fact("fact1", "valueId")]: "Developer Tunggal",
    [fact("fact2", "labelId")]: "Klien",
    [fact("fact2", "valueId")]: "Pemerintah Desa Tanakaraeng, Gowa",
    [fact("fact3", "valueId")]: "KKN-T Universitas Hasanuddin Gelombang 114",
    [fact("fact4", "labelId")]: "Teknologi",
    [block("block1", "headingId")]: "Gambaran Umum",
    [block("block1", "bodyId")]:
      "Selama program KKN-T Gelombang 114 Universitas Hasanuddin di Desa Tanakaraeng, Kecamatan Manuju, Kabupaten Gowa, saya merancang dan membangun website resmi pertama desa tersebut.\n\n" +
      "Website ini menyatukan profil desa, struktur pemerintahan, data kependudukan, potensi desa, UMKM, dan berita desa dalam satu tempat, serta menyediakan kanal online bagi warga untuk menyampaikan pengaduan. Seluruh konten dikelola sendiri oleh perangkat desa melalui dashboard admin.",
    [inBlock("block2", "items", "stat1", "valueId")]: "4 minggu",
    [inBlock("block2", "items", "stat1", "labelId")]: "Dari baris kode pertama hingga peluncuran",
    [inBlock("block2", "items", "stat2", "labelId")]: "Fitur utama dalam satu platform",
    [inBlock("block2", "items", "stat3", "valueId")]: "2.700",
    [inBlock("block2", "items", "stat3", "labelId")]: "Warga yang dilayani",
    [inBlock("block2", "items", "stat4", "valueId")]: "Rp315 rb",
    [inBlock("block2", "items", "stat4", "labelId")]: "Total anggaran proyek",
    [block("block3", "headingId")]: "Latar Belakang",
    [block("block3", "pointsId")]: [
      "Desa Tanakaraeng memiliki 2.700 penduduk dalam 872 kepala keluarga, yang sebagian besar bekerja sebagai petani, peternak, dan pelaku usaha kecil.",
      "Desa belum memiliki media digital resmi. Informasi disebarkan melalui papan pengumuman, rapat desa, dan dari mulut ke mulut, sehingga warga yang tinggal jauh dari pusat desa dan masyarakat luar sulit mengaksesnya.",
      "Produk dan usaha lokal hanya dikenal di dalam desa, dan catatan kegiatan masih disimpan secara manual.",
      "Warga yang ingin menyampaikan pengaduan harus datang langsung ke kantor desa.",
    ],
    [block("block4", "headingId")]: "Masalah & Solusi",
    [inBlock("block4", "items", "pair1", "problemId")]:
      "Informasi desa (profil, struktur pemerintahan, data kependudukan, berita) hanya sampai ke warga melalui papan pengumuman dan dari mulut ke mulut.",
    [inBlock("block4", "items", "pair1", "solutionId")]:
      "Website publik dengan halaman profil desa, struktur pemerintahan, infografis kependudukan, dan berita yang dapat diakses dari perangkat apa pun.",
    [inBlock("block4", "items", "pair2", "problemId")]: "Produk lokal dan usaha kecil hanya dikenal di dalam desa.",
    [inBlock("block4", "items", "pair2", "solutionId")]:
      "Direktori UMKM dan halaman Potensi Desa yang mempromosikan usaha dan potensi desa ke khalayak yang lebih luas.",
    [inBlock("block4", "items", "pair3", "problemId")]:
      "Warga harus datang langsung ke kantor desa untuk menyampaikan pengaduan.",
    [inBlock("block4", "items", "pair3", "solutionId")]:
      "Formulir pengaduan online yang tersedia di setiap halaman dan langsung terkirim ke email desa.",
    [inBlock("block4", "items", "pair4", "problemId")]: "Tanpa developer di desa, website bisa cepat tidak terurus.",
    [inBlock("block4", "items", "pair4", "solutionId")]:
      "Dashboard admin agar perangkat desa dapat memperbarui konten sendiri, disertai pelatihan langsung dan buku panduan cetak.",
    [block("block5", "headingId")]: "Proses",
    [inBlock("block5", "steps", "step1", "titleId")]: "Observasi & identifikasi masalah",
    [inBlock("block5", "steps", "step1", "descriptionId")]:
      "Observasi lapangan dan wawancara dengan kepala desa serta perangkat desa untuk memetakan masalah informasi dan layanan.",
    [inBlock("block5", "steps", "step2", "titleId")]: "Perancangan website",
    [inBlock("block5", "steps", "step2", "descriptionId")]:
      "Menyusun struktur halaman berdasarkan data monografi desa dan masukan perangkat desa: Profil, Struktur Pemerintahan, Data Kependudukan, Potensi Desa, UMKM, Berita, dan Pengaduan Online. Desain dibuat sederhana dan mudah digunakan.",
    [inBlock("block5", "steps", "step3", "titleId")]: "Pengembangan",
    [inBlock("block5", "steps", "step3", "descriptionId")]:
      "Membangun halaman publik terlebih dahulu (navbar, beranda, profil, infografis, potensi, UMKM, berita), lalu login admin, dashboard, dan koneksi database. Setiap halaman diisi dengan data asli dari perangkat desa, dan formulir pengaduan dihubungkan ke email desa.",
    [inBlock("block5", "steps", "step4", "titleId")]: "Pengujian & hosting",
    [inBlock("block5", "steps", "step4", "descriptionId")]:
      "Membuat website responsif untuk tablet dan HP, memperbaiki bug, menguji setiap fitur, lalu mempublikasikannya di domain publik.",
    [inBlock("block5", "steps", "step5", "titleId")]: "Pelatihan",
    [inBlock("block5", "steps", "step5", "descriptionId")]:
      "Melatih perangkat desa yang ditunjuk untuk menggunakan dashboard admin: mengunggah berita, memperbarui data, dan menangani pengaduan.",
    [inBlock("block5", "steps", "step6", "titleId")]: "Serah terima",
    [inBlock("block5", "steps", "step6", "descriptionId")]:
      "Menyerahkan website kepada pemerintah desa pada 6 Agustus 2025, beserta buku panduan penggunaan.",
    [block("block6", "headingId")]: "Tampilan",
    [inBlock("block6", "images", "img1", "captionId")]: "Infografis: data kependudukan dan stunting",
    [inBlock("block6", "images", "img2", "captionId")]: "Direktori UMKM dengan filter kategori",
    [inBlock("block6", "images", "img3", "captionId")]: "Berita desa, dikelola dari dashboard admin",
    [block("block7", "headingId")]: "Hasil",
    [block("block7", "bodyId")]:
      "Website diluncurkan tepat waktu dan dapat diakses publik. Kepala desa menyatakan melalui surat resmi bahwa website ini digunakan oleh masyarakat, berfungsi dengan baik, dan membantu desa menuju transformasi digital. Peluncurannya juga diliput oleh Unhas TV.",
    [block("block7", "pointsId")]: [
      "Website resmi dengan profil desa, struktur pemerintahan, infografis kependudukan, potensi desa, direktori UMKM, berita, dan pengaduan online.",
      "Perangkat desa terlatih yang mengelola konten secara mandiri melalui dashboard admin.",
      "Buku panduan cetak (Buku Panduan Penggunaan Website Desa Tanakaraeng), agar website tetap berjalan meskipun perangkat desa berganti.",
    ],
  },

  "project-cyber-security-web-app": {
    tagsId: ["Aplikasi Web", "UI/UX", "Desain Web"],
    shortDescriptionId:
      "Aplikasi web bagi Pemerintah Kabupaten Gowa untuk mengelola, memvalidasi, dan menerbitkan Surat Ketetapan Retribusi Daerah (SKRD) secara digital.",
    timelineId: "2 Minggu",
    [fact("bce23cc03aa8", "labelId")]: "Peran",
    [fact("1bcaee4df1b1", "labelId")]: "Studi Kasus",
  },

  "project-nala-mobile-app": {
    tagsId: ["Desain Grafis", "Media Sosial", "Feed Instagram"],
    shortDescriptionId: "Konsep feed Instagram yang berani untuk Xavior Gym, tampil mencolok di timeline.",
    timelineId: "1 Minggu",
  },

  "5fc0fc2e-5887-4f8d-b4ba-038d3a8d2454": {
    tagsId: ["Editing Foto", "Color Grading", "Fotografi"],
    shortDescriptionId:
      "Eksplorasi editing foto di mana setiap frame memiliki suasananya sendiri, dibentuk melalui warna yang berani, kontras yang kuat, dan komposisi minimalis.",
    timelineId: "Masih berjalan",
  },
};

async function run() {
  const ids = Object.keys(TRANSLATIONS);
  const existing = new Set(await client.fetch(`*[_id in $ids]._id`, { ids: ids.flatMap((id) => [id, `drafts.${id}`]) }));

  const missing = ids.filter((id) => !existing.has(id) && !existing.has(`drafts.${id}`));
  if (missing.length > 0) console.warn("Not found (skipped):", missing.join(", "));

  const transaction = client.transaction();
  let patched = 0;
  for (const [id, fields] of Object.entries(TRANSLATIONS)) {
    for (const target of [id, `drafts.${id}`]) {
      if (!existing.has(target)) continue;
      transaction.patch(target, (patch) => patch.setIfMissing(fields));
      patched += 1;
    }
  }
  await transaction.commit();
  console.log(`Done! Indonesian texts added to ${patched} document(s). Check them in the Studio.`);
}

run().catch((error) => {
  console.error("Failed:", error.message);
  process.exit(1);
});
