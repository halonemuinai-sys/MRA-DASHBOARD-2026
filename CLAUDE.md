# CLAUDE.md — MRA Holding Executive Dashboard

## Project Context
Centralized executive dashboard untuk **MRA Holding Group** yang memonitor semua business unit secara real-time.
Tech stack: Express.js + Node.js + Prisma + PostgreSQL (backend) · React.js + Vite + Tailwind CSS + Recharts (frontend).
Dua repo terpisah: `mra-dashboard-backend/` dan `mra-dashboard-frontend/`.

---

## Struktur Korporat MRA Group

### Business Units & Entitas Legal
| Segment | Brand | Keterangan |
|---------|-------|-----------|
| **F&B** | Häagen-Dazs | Franchise — revenue dari penjualan gerai |
| **F&B** | HardRock Café Bali | Lisensi — pendapatan F&B + merchandise |
| **F&B** | Jamba Juice | Franchise — juice bar format |
| **F&B** | Bateel | Premium dates & café — imported product |
| **Retail** | Bvlgari | Consignment + outright purchase dari principal |
| **Retail** | Omega | Authorized dealer — beli putus dari principal |
| **Retail** | Chronology | Multi-brand watch retailer |
| **Retail** | Boucheron | High jewelry — consignment model |
| **Media** | Digital | Digital marketing agency |
| **Media** | PMD | Print & media division |
| **Media** | Events | Event organizer |
| **Media** | BMD | Brand management & distribution |

### Entitas Konsolidasi
- Laporan keuangan dikonsolidasikan di level **MRA Holding**
- Eliminasi transaksi intercompany wajib dilakukan sebelum reporting
- Holding company cost dialokasikan ke BU menggunakan **cost allocation key** (proporsional terhadap revenue)

---

## Standar Akuntansi & Kebijakan

### Standar yang Digunakan
- **PSAK** (Pernyataan Standar Akuntansi Keuangan) — standar akuntansi Indonesia
- Beberapa entitas dengan principal asing mengacu IFRS untuk pelaporan ke principal

### Kebijakan Utama
- **Mata uang fungsional:** IDR (Rupiah Indonesia)
- **Mata uang pelaporan ke principal:** USD (untuk Bvlgari, Omega, Boucheron, Häagen-Dazs)
- **Kurs konversi:** menggunakan kurs Bank Indonesia tengah bulan pelaporan (bukan kurs tetap)
- **Fiscal year:** Januari — Desember (calendar year)
- **Closing tanggal:** H+5 setelah bulan berakhir (soft close), H+10 (hard close)
- **Depreciation method:** Straight-line untuk semua aset tetap

### Revenue Recognition
- **F&B:** Diakui saat transaksi penjualan terjadi di kasir (point of sale)
- **Retail Consignment:** Diakui setelah barang terjual kepada end-customer (bukan saat terima barang dari principal)
- **Retail Outright:** Diakui saat barang diserahkan ke customer (transfer of control)
- **Media/Events:** Percentage of completion atau saat event selesai

---

## Definisi KPI & Formula

### P&L Hierarchy (Urutan Laporan Laba Rugi)
```
Gross Revenue
  - Sales Return & Discount
= Net Revenue  ← ini yang dimaksud "Revenue" di dashboard

  - Cost of Goods Sold (COGS)
    - F&B: Food cost + beverage cost + packaging
    - Retail: HPP (purchase price + duties + freight)
    - Media: Direct project cost

= Gross Profit

  - Operating Expenses (OPEX)
    - Payroll & Benefits (employee cost)
    - Rental & Service Charge
    - Utilities (electricity, water, internet)
    - Marketing & Promotion
    - G&A (General & Administrative)
    - Depreciation & Amortization

= EBIT (Earnings Before Interest & Tax)

  - Interest Expense (net of interest income)

= EBT (Earnings Before Tax)

  - Income Tax (PPh Badan ~22%)

= Net Profit / Net Income
```

### EBITDA
```
EBITDA = EBIT + Depreciation + Amortization
       = Gross Profit - OPEX (excl. D&A)

EBITDA Margin = EBITDA / Net Revenue × 100%
```
> **Catatan:** Di beberapa laporan internal MRA, istilah "EBITDA" kadang digunakan untuk EBIT. Selalu klarifikasi dengan Finance team apakah D&A sudah dikeluarkan atau belum.

### Gross Profit Margin
```
Gross Profit Margin = Gross Profit / Net Revenue × 100%

Benchmark per segment:
- F&B target: > 60% (food cost ratio < 40%)
- Retail Luxury target: > 45% (COGS termasuk duties ~55%)
- Media/Events target: > 35%
```

### Cash Flow Metrics
```
Operating Cash Flow = Net Profit + D&A ± Working Capital Changes
Free Cash Flow      = Operating Cash Flow - CAPEX
Cash Conversion Cycle = DSO + DIO - DPO
  DSO (Days Sales Outstanding) = AR / Revenue × 365
  DIO (Days Inventory Outstanding) = Inventory / COGS × 365
  DPO (Days Payable Outstanding) = AP / COGS × 365
```

### Working Capital
```
Net Working Capital = Current Assets - Current Liabilities
  Current Assets: Cash + AR + Inventory + Prepaid
  Current Liabilities: AP + Accruals + Short-term debt
```

### AP & AR Aging Buckets (Standard MRA)
```
Current / 0-30 hari   → Normal, dalam terms pembayaran
31-60 hari            → Early warning, follow-up
61-90 hari            → Overdue, eskalasi ke Finance Manager
> 90 hari             → Doubtful, perlu provision atau legal action
```

### CAPEX Categories
```
- Renovation & Fit-out   → amortisasi sesuai sisa masa sewa
- IT Infrastructure      → 4-5 tahun
- Equipment & Machinery  → 5-8 tahun
- Vehicles               → 5 tahun
- Furniture & FF&E       → 5 tahun
```

---

## HR & Headcount Metrics

### Definisi
- **Headcount:** Karyawan aktif per tanggal cut-off (tidak termasuk contract worker kecuali dinyatakan)
- **FTE (Full-Time Equivalent):** Standar 160 jam/bulan
- **Turnover Rate:** (Karyawan keluar dalam periode / Rata-rata headcount) × 100%
  - Target MRA Group: < 8% per tahun untuk permanent staff
- **Attendance Rate:** Hari hadir aktual / Hari kerja seharusnya × 100%
  - Target: > 95% (workdays, tidak termasuk cuti tahunan yang disetujui)

### Employee Cost Components
```
Employee Cost = Gaji Pokok + Tunjangan Tetap + BPJS (Ketenagakerjaan + Kesehatan)
              + Bonus & Insentif + THR (pro-rata) + Training Cost
              + Uniform & Benefits in Kind

Employee Cost Ratio = Total Employee Cost / Net Revenue × 100%
Target: < 20% (F&B bisa sampai 25% karena labor-intensive)
```

---

## Operational Metrics

### Store Productivity
```
Revenue per m²    = Total Revenue / Total Floor Area (m²)
Revenue per Store = Total Revenue / Jumlah Gerai
Same-Store Sales Growth (SSSG) = Growth revenue gerai yang sudah ada > 12 bulan
```

### Rental Cost Ratio
```
Rental Cost Ratio = (Rent + Service Charge) / Net Revenue × 100%
Benchmark: < 10% untuk retail luxury, < 15% untuk F&B
Alert jika: > 15% untuk retail, > 20% untuk F&B
```

---

## GA (General Affairs) Metrics

### Asset Categories (PSAK 16)
```
- Tanah: tidak disusutkan
- Gedung & Bangunan: 20-40 tahun
- Kendaraan: 5 tahun (metode garis lurus)
- Peralatan IT: 4-5 tahun
- Furniture: 5 tahun
```

### Asset Utilization Rate
```
= Aset yang digunakan aktif / Total aset × 100%
Target: > 80% untuk semua kategori
```

---

## Legal & Compliance Metrics

### Contract Expiry Alert Tiers
```
> 12 bulan  → Green — aman
6-12 bulan  → Yellow — mulai review & negosiasi
< 6 bulan   → Orange — urgent renewal
< 3 bulan   → Red — kritis, eskalasi ke BOD
```

### Compliance Risk Level Definition
```
Low:    Tidak ada sanksi regulasi, potensi denda < Rp 50 juta
Medium: Potensi sanksi regulasi, denda Rp 50-500 juta, atau reputasi
High:   Potensi pencabutan izin usaha, denda > Rp 500 juta, atau pidana
```

### DOA (Delegation of Authority)
- Dokumen yang mendefinisikan batas kewenangan approval per jabatan
- Setiap transaksi > threshold harus ada approval sesuai DOA yang berlaku
- Dashboard monitor apakah transaksi diproses sesuai DOA (compliance %)

---

## Dashboard Display Rules

### Format Angka
- IDR: tampilkan dalam **Billion (B)** dengan 1 desimal untuk angka > 1B, tanpa desimal untuk < 1B
  - Contoh: Rp 1,738.5B → tampil "Rp 1,738.5B" atau "Rp 1.7T" di summary
- USD: tampilkan dalam **Million (M)** untuk nilai > 1M
- Persentase: 1 desimal (misal: 26.1%, bukan 26% atau 26.14%)
- Kurs referensi dashboard: **Rp 15,800/USD** (update manual per kuartal, atau dari endpoint Bank Indonesia)

### Warna Indikator (Traffic Light)
```
Hijau  (emerald-700) → Di atas target / positif
Kuning (amber-600)   → Mendekati batas / warning
Merah  (red-600)     → Di bawah target / negatif / kritis
Abu    (slate-400)   → Tidak ada data / N/A
```

### YoY Calculation
```
YoY Growth = (Nilai Periode Ini - Nilai Periode Sama Tahun Lalu) / |Nilai Tahun Lalu| × 100%
Hati-hati: jika tahun lalu rugi (negatif), arah pertumbuhan bisa misleading
```

### Budget vs Actual
```
Achievement % = Actual / Budget × 100%
Over budget (expense) = merah (buruk)
Over budget (revenue) = hijau (baik)
Gunakan konteks: revenue over-budget = positif, cost over-budget = negatif
```

---

## Hal yang Sering Salah Diinterpretasi

1. **EBITDA ≠ Cash Flow** — EBITDA belum memperhitungkan perubahan working capital dan CAPEX
2. **Revenue Retail consignment** — jangan hitung nilai barang yang diterima dari principal sebagai revenue, hanya yang sudah terjual
3. **Intercompany sales** — transaksi antar entity MRA Group harus dieliminasi di laporan konsolidasi
4. **Bonus & THR** — accrued sepanjang tahun, bukan hanya saat dibayarkan (matching principle)
5. **CAPEX vs OPEX** — pengeluaran < threshold (biasanya Rp 5 juta) langsung expense, bukan dikapitalisasi
6. **Turnover rate** — hitung berdasarkan **voluntary turnover** saja untuk benchmark industri (jangan campur PHK massal)
7. **% to Revenue** — selalu gunakan **Net Revenue** (setelah retur & diskon) sebagai denominator, bukan Gross Revenue

---

## Pertanyaan yang Harus Selalu Dikonfirmasi ke Finance Team
- Apakah angka sudah diaudit atau masih management accounts?
- Sudah ada eliminasi intercompany?
- Kurs yang digunakan (rata-rata bulan atau akhir bulan)?
- Apakah ada extraordinary item yang harus di-exclude dari trend?
- Apakah EBITDA sudah exclude D&A atau masih EBIT?

---

## Financial Ratio Framework (dari alirezarezvani/claude-skills)

### Profitability Ratios
```
ROE  = Net Profit / Shareholders' Equity × 100%
ROA  = Net Profit / Total Assets × 100%
Gross Margin   = Gross Profit / Revenue × 100%
Operating Margin = EBIT / Revenue × 100%
Net Margin     = Net Profit / Revenue × 100%

⚠️ High leverage dapat inflate ROE — gunakan DuPont decomposition untuk insights lebih dalam:
ROE = Net Margin × Asset Turnover × Equity Multiplier
```

### Liquidity Ratios
```
Current Ratio = Current Assets / Current Liabilities
  → Healthy: 1.5–3.0x | < 1.0x = masalah likuiditas | > 3.0x = aset tidak efisien

Quick Ratio = (Current Assets - Inventory) / Current Liabilities
  → Target: > 1.0x

Cash Ratio = Cash & Equivalents / Current Liabilities
  → Ukuran paling konservatif
```

### Leverage Ratios
```
Debt-to-Equity = Total Debt / Shareholders' Equity
Interest Coverage (ICR) = EBIT / Interest Expense
  → < 1.5x = red flag untuk lenders | Target: > 3.0x

DSCR (Debt Service Coverage) = Operating Cash Flow / Total Debt Service
```

### Efficiency Ratios
```
Asset Turnover     = Revenue / Total Assets
Inventory Turnover = COGS / Average Inventory
  → Benchmark per segmen:
    F&B: 12–24x/tahun (perishable goods)
    Retail Luxury: 1–3x/tahun (high-value, slow-moving)

DSO  = (AR / Revenue) × 365      → Target < 30 hari untuk F&B, < 60 hari untuk B2B
DIO  = (Inventory / COGS) × 365  → Target F&B < 30 hari, Retail Luxury 90–180 hari
DPO  = (AP / COGS) × 365         → Target > 30 hari (leverage ke supplier)
CCC  = DSO + DIO - DPO           → Makin kecil makin baik
```

### Valuation Ratios (untuk referensi analisa M&A / investasi)
```
EV/EBITDA: F&B 8–12x | Retail Luxury 10–18x | Media/Events 6–10x
P/E:       F&B 15–25x | Retail 15–25x
EV/Revenue: Media/Digital 2–5x
```

---

## Forecasting Framework (dari alirezarezvani/claude-skills)

### Driver-Based Revenue Forecast
```
F&B Revenue   = Jumlah Gerai × Avg Revenue per Gerai × Occupancy Rate
Retail Revenue = Avg Ticket Size × Jumlah Transaksi × Conversion Rate
Media Revenue  = Jumlah Klien × Avg Project Value × Win Rate
```

### Forecast Accuracy Targets
```
Revenue forecast: ±5% MAPE (Mean Absolute Percentage Error)
Expense forecast: ±3% MAPE
```

### Scenario Planning (Wajib untuk BOD reporting)
```
Base Case  (prob 50–60%): Trajectory saat ini, asumsi konservatif
Bull Case  (prob 15–25%): Kondisi favorable — traffic naik, kurs IDR menguat
Bear Case  (prob 15–25%): Downside realistis — kenaikan sewa, pelemahan rupiah

Setiap skenario harus punya asumsi driver spesifik, bukan hanya ±% dari base
```

### Rolling Forecast Cadence
```
Weekly:    Cash flow 13 minggu ke depan
Monthly:   Rolling forecast 12 bulan ke depan (update 2–5 hari per siklus)
Quarterly: Full recast dengan review asumsi
```

---

## Industry Benchmarks Relevan untuk MRA Group

### Retail Luxury (Bvlgari, Omega, Boucheron, Chronology)
```
Gross Margin target:  > 45–55%
EBITDA Margin target: > 18–25%
Revenue per m²:       Rp 800–1,500 juta/tahun (premium mall)
Rental Cost Ratio:    < 10%
Inventory Turnover:   1–3x/tahun (beli putus) | tidak berlaku consignment
Same-Store Sales Growth (SSSG): benchmark industri luxury Indonesia +8–15%
EV/EBITDA valuation:  10–18x
⚠️ Seasonal: Q4 (Natal/Tahun Baru) biasanya 30–40% lebih tinggi dari bulan biasa
```

### F&B (Häagen-Dazs, HardRock, Jamba Juice, Bateel)
```
Food Cost Ratio:      25–35% dari revenue (target < 30%)
Beverage Cost Ratio:  20–28% dari revenue
Labor Cost Ratio:     20–28% dari revenue (termasuk BPJS, THR)
Rental Cost Ratio:    < 15% dari revenue
EBITDA Margin target: > 12–18%
Inventory Turnover:   12–24x/tahun (bahan baku fresh)
Revenue per Seat:     Rp 500rb–2jt/bulan tergantung format & lokasi
EV/EBITDA valuation:  8–12x
```

### Media & Events (Digital, PMD, Events, BMD)
```
Gross Margin target:  > 35–45% (setelah direct project cost)
EBITDA Margin target: > 10–15%
Utilization Rate:     > 75% (jam kerja billable / total jam tersedia)
Revenue per Employee: > Rp 500 juta/tahun
Receivable Days:      < 60 hari (project-based billing)
EV/Revenue:           2–5x untuk digital agency
```

---

## Analisa Excel / Data — Panduan untuk Claude

Saat membaca file Excel keuangan MRA:

1. **Sheet P&L:** Pastikan ada baris Net Revenue (bukan Gross Revenue) sebagai denominator %
2. **Sheet Budget:** Cek apakah budget sudah include asumsi inflasi dan kurs
3. **Kolom YTD:** Konfirmasi apakah YTD adalah kumulatif atau rata-rata per bulan
4. **Angka negatif:** Di Excel finance biasanya ditampilkan dalam kurung `(xxx)` atau merah — interpret sebagai pengurangan
5. **Multi-currency sheet:** Cek apakah ada kolom "Currency" — jangan campur IDR dan USD tanpa konversi
6. **Pivot/Summary sheet:** Sering ada eliminasi intercompany di baris khusus — jangan double count
7. **Budget vs Actual variance:** `Fav` = favorable (baik), `Unf` = unfavorable (buruk) — konteksnya tergantung apakah baris revenue atau cost
