# Design Review — MRA Holding Executive Dashboard
**Reviewed:** 06 Jun 2026  
**Method:** jezweb/claude-skills design-review framework (7 areas)  
**Scope:** All 8 pages — Login, Executive Summary, Financial, HR, Operational, GA, Legal, Compliance

---

## Overall Impression
Dashboard berfungsi dengan baik dan konten sudah solid. Secara keseluruhan terlihat **developer-built** — fungsional tapi belum polish. Issues utama: warna hardcoded di seluruh codebase (tidak ada semantic tokens), tiga implementasi "traffic light" berbeda, dan type scale yang tidak konsisten. Tidak ada dark mode readiness.

---

## Findings by Severity

### 🔴 HIGH — Harus diperbaiki

**H1 · Hardcoded Colors — Tidak ada Semantic CSS Variables**
- `bg-blue-50`, `text-emerald-700`, `border-l-blue-500` tersebar di 12+ komponen
- Tidak ada `--color-primary`, `--color-success`, dll di CSS
- Tidak bisa dark mode tanpa ubah ratusan class
- Pelanggaran prinsip "single source of truth"
- **Fix:** Implement `@theme inline` CSS variables (Tailwind v4 pattern)

**H2 · Component Inconsistency — 3 Traffic Light Berbeda**
- `KpiCard` → hardcoded via `accentMap` object
- `RatioPanel` → via `getTrafficLight()` + `trafficLightClasses`
- `Financial.jsx` → inline hardcoded string `'#065f46'` / `'#dc2626'`
- Pembaca kode tidak bisa predict warna merah/hijau dari mana
- **Fix:** Satu sumber — semantic CSS variables + satu helper function

**H3 · Typography Scale Tidak Konsisten**
- 6 ukuran berbeda: `text-[9px]`, `text-[10px]`, `text-xs`, `text-sm`, `text-base`, `text-2xl`, `text-3xl`
- `text-[9px]` dan `text-[10px]` = arbitrary values, tidak ada di Tailwind scale
- Section titles ada yang uppercase tracking-wider, ada yang tidak
- KPI number: sebagian `text-2xl`, sebagian `text-3xl` — tidak konsisten
- **Fix:** Definisikan type scale: display / heading / body / caption / micro

**H4 · Tidak Ada Loading / Feedback State**
- Ganti filter (period, currency, segment) → data langsung ganti, tidak ada transisi
- Chart render tanpa animasi
- Tidak ada skeleton screen saat "data loading"
- Untuk BOD presentation, ini terlihat kasar
- **Fix:** Tambah loading skeleton + transition state di filter change

---

### 🟡 MEDIUM — Perlu diperbaiki

**M1 · Border Radius Tidak Konsisten**
- Mix: `rounded-lg` (8px), `rounded-xl` (12px), `rounded-2xl` (16px) tanpa aturan
- Cards kadang `rounded-xl`, kadang `rounded-2xl`
- Tables: `overflow-hidden` tanpa `rounded` di wrapper → corners squared
- **Fix:** Establish radius tokens: card=12px, button=8px, badge=6px, chip=99px

**M2 · Shadow Tidak Konsisten**
- Mix: `shadow-sm`, `shadow-md`, dan tidak ada shadow
- Cards di halaman berbeda punya visual weight berbeda padahal same component type
- **Fix:** Satu shadow level untuk cards: `shadow-sm` everywhere

**M3 · Spacing Sections Tidak Konsisten**
- `mb-4`, `mb-5`, `mb-6` dipakai bergantian untuk section spacing
- Chart heights: 160px, 180px, 200px, 220px, 230px, 260px, 280px — tidak ada sistem
- **Fix:** Standard: `gap-4` antara cards, `mb-6` between sections, chart heights 200/260/320

**M4 · Section Header Pattern Tidak Konsisten**
- Beberapa section pakai `<h2 className="text-xs uppercase tracking-wider">` 
- Beberapa tidak punya header sama sekali
- Financial page campuran keduanya
- **Fix:** Satu Section component yang wajib dipakai

---

### 🟢 LOW — Nice to have

**L1 · Tidak Ada Focus Ring (Accessibility)**
- Keyboard navigation tidak ada visual indicator
- Buttons dan NavLinks tidak punya `:focus-visible` style custom
- **Fix:** Tambah `focus-visible:ring-2 focus-visible:ring-amber-400` di semua interactables

**L2 · Tidak Responsive (Mobile)**
- Sidebar fixed `w-60` — di mobile akan overlap content
- Chart tidak reflow di lebar sempit
- **Fix:** Add `lg:block hidden` untuk sidebar, mobile hamburger (out of scope saat ini)

**L3 · Chart Colors Tidak Terhubung ke Brand Palette**
- Chart pakai warna arbitrary (`#1e3a8a`, `#065f46`, `#92400e`) — tidak dari design system
- Jika brand color berubah, harus update manual di setiap chart
- **Fix:** Central `CHART_COLORS` constant dari CSS variables

---

## Priority Fix Plan

| # | Issue | Impact | Effort | Urutan |
|---|-------|--------|--------|--------|
| H1 | Semantic CSS variables | Tinggi | Medium | 1 |
| H2 | Unified traffic light system | Tinggi | Low | 2 |
| H3 | Typography scale | Medium | Low | 3 |
| M1 | Border radius tokens | Medium | Low | 4 |
| M2 | Shadow consistency | Low | Low | 5 |
| H4 | Loading states | Medium | Medium | 6 |
