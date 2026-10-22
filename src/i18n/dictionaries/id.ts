import type { Dictionary } from "./en";

// Teks Bahasa Indonesia untuk website (semua yang tidak diubah di Studio).
// Kuncinya harus sama persis dengan en.ts.

export const id: Dictionary = {
  meta: {
    portfolio: "Portofolio",
    workTitle: "Karya",
    workDescription:
      "Semua proyek Alif Rezky Maulana: desain UI/UX, pengembangan web, dan desain grafis, dari proyek nyata untuk klien hingga eksplorasi pribadi.",
    projectImageAlt: "Proyek dari portofolio Alif Rezky Maulana",
  },
  common: {
    letsTalk: "Hubungi Saya",
    back: "Kembali",
    backToTop: "Kembali ke atas",
    skipToContent: "Langsung ke konten",
    language: "Bahasa",
  },
  nav: {
    label: "Menu utama",
    open: "Buka navigasi",
    work: "Karya",
    service: "Layanan",
    capabilities: "Kemampuan",
    about: "Tentang Saya",
  },
  hero: {
    browseProjects: "Lihat Proyek",
  },
  work: {
    watermark: "Portofolio",
    selectedWork: "Karya Pilihan",
    allWork: "Semua Karya",
    viewAll: "Lihat Semua Karya",
    moreWork: "Karya Lainnya",
    filterLabel: "Filter proyek",
    all: "Semua",
    empty: "Belum ada proyek di kategori ini.",
  },
  category: {
    "real-project": "Proyek Nyata",
    exploration: "Eksplorasi",
  },
  service: {
    watermark: "Layanan",
    title: "Layanan",
  },
  capabilities: {
    watermark: "Kemampuan",
    title: "Keahlian & Tools Utama",
    tools: "Tools yang biasa saya gunakan",
  },
  about: {
    watermark: "Tentang",
    title: "Tentang Saya",
    downloadCv: "Unduh CV",
  },
  education: {
    title: "/Pendidikan",
    graduated: "Lulus · 2026",
    degreeLevel: "Sarjana",
    major: "Sistem Informasi",
    gpa: "IPK",
  },
  project: {
    service: "Layanan",
    timeline: "Waktu",
    tools: "Tools",
    livePreview: "Lihat Langsung",
    contents: "Daftar Isi",
    sectionsLabel: "Bagian studi kasus",
    problem: "Masalah",
    solution: "Solusi",
  },
  footer: {
    ctaHeading: "Punya ide proyek?",
  },
  notFound: {
    title: "Halaman tidak ditemukan",
    text: "Halaman yang Anda cari tidak ada atau sudah dipindahkan.",
    backHome: "Kembali ke beranda",
  },
  contact: {
    status: "Biasanya membalas dalam 1–2 hari",
    close: "Tutup panel pesan",
    intro:
      "Halo! Ceritakan sedikit tentang proyek atau ide Anda. Pesan Anda langsung masuk ke email saya, dan saya akan membalas lewat email.",
    sent: "Pesan terkirim ✓",
    thanks: "Terima kasih, {name}! Pesan Anda sudah saya terima dan akan segera saya balas ke {email}.",
    sendAnother: "Kirim pesan lain",
    name: "Nama",
    namePlaceholder: "Nama Anda",
    email: "Email",
    emailPlaceholder: "anda@email.com",
    message: "Pesan",
    messagePlaceholder: "Apa yang sedang Anda kerjakan?",
    send: "Kirim pesan",
    sending: "Mengirim…",
    emailDirectly: "Anda juga bisa langsung mengirim email ke",
    preferEmail: "Lebih suka email?",
    copyEmail: "Salin {email}",
    copied: "Tersalin!",
    errors: {
      name: "Mohon isi nama Anda.",
      email: "Mohon isi alamat email yang valid.",
      message: "Mohon tulis pesan minimal 10 karakter.",
      links: "Mohon sertakan maksimal {max} link.",
      timedOut: "Formulir ini kedaluwarsa. Silakan tekan kirim lagi.",
      tooMany: "Anda sudah mengirim beberapa pesan. Silakan coba lagi nanti.",
      notSetUp: "Pengiriman pesan belum diatur.",
      failed: "Pesan Anda tidak dapat terkirim.",
    },
  },
};
