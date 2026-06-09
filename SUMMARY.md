# MRA Holding Executive Dashboard — Project Summary
**Tanggal:** 06 Juni 2026  
**Status:** Frontend mockup selesai · Backend belum dimulai

---

## 1. Overview

Centralized executive dashboard untuk **MRA Holding Group** — memonitor semua business unit secara real-time.  
Sumber: PRD `PRD MRA Group 2026 .xlsx`

| Item | Detail |
|------|--------|
| Business Units | 11 brand — F&B, Retail, Media |
| Dashboard Modules | 7 modul (Executive, Financial, HR, Operational, GA, Legal, Compliance) |
| Target Users | BOD, CEO/COO/CFO, Department Heads, Finance/HR/GA/Legal/Compliance teams |
| RBAC | 13 role dengan akses berbeda per modul |
| Data Source | Kombinasi — sync dari sistem existing + manual input form |
| Refresh | Minimum 1 jam, daily closing auto-refresh |

---

## 2. Tech Stack (Dikonfirmasi)

### Frontend — `mra-dashboard-frontend/` ✅ Selesai mockup
| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@theme inline` CSS variables) |
| UI Components | **shadcn/ui** (15 komponen) |
| Charts | Recharts (Area, Bar, Pie, Radar, Scatter, Treemap, Waterfall custom) |
| Routing | React Router DOM v7 |
| Icons | lucide-react |
| Font | Geist Variable |
| Design System | `src/design/tokens.js` — single source of truth |

### Backend — `mra-dashboard-backend/` ❌ Belum dibuat
| Layer | Tech |
|-------|------|
| Server | Express.js + Node.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (access + refresh token) + bcrypt |
| RBAC | Middleware per role |

---

## 3. Frontend — Yang Sudah Dibuat

### Halaman (8 halaman)
| Halaman | Path | Highlight |
|---------|------|-----------|
| Login | `/login` | Split layout — brand panel + form, demo accounts list |
| Executive Summary | `/` | Tab: Dashboard + Benchmark Scorecard (Radar EBITDA% ter-upgrade) |
| Financial | `/financial` | P&L Waterfall, Treemap, Portfolio Scatter, Ratio Panel (Interaktif Tooltips) |
| HR | `/hr` | KPI cards, donut headcount, training KPI, recruitment table |
| Operational | `/operational` | Store-level breakdown, rental ratio, utilities cost gradien |
| General Affairs | `/ga` | Asset cards, vendor table, purchase request tracking |
| Legal | `/legal` | Contract repository, litigation tracking (shadcn Table + Badge) |
| Compliance | `/compliance` | Module status cards, whistleblowing chart, risk register |

### Komponen Custom (Recharts & UI)
| Komponen | File | Keterangan |
|----------|------|-----------|
| WaterfallChart | `charts/WaterfallChart.jsx` | P&L bridge Revenue → Net Profit |
| BrandScatter | `charts/BrandScatter.jsx` | Portfolio matrix: YoY vs EBITDA%, size = revenue |
| RevenueTreemap | `charts/RevenueTreemap.jsx` | Revenue per brand — visual relative size |
| RatioPanel | `charts/RatioPanel.jsx` | 13 ratios dengan gauge bar & penjelasan tooltips interaktif |
| CustomAngleTick | `BenchmarkScorecard.jsx` | Ticks sudut radar yang dianimasikan melayang lembut |

---

## 4. Fitur Interaktivitas Unggulan Terbaru

*   **Pilihan Bulan & Tahun di Topbar**: Ditambahkan dropdown dinamis untuk memfilter bulan & tahun yang secara otomatis menyesuaikan YTD secara akumulatif.
*   **Breakdown Multi-Store Ritel**: Memilih brand retail (e.g. *Bvlgari, Omega, Atmos*) langsung mengonversi grafik operasional ke analisis performa antar-store individual.
*   **Aksen Warna Non-AI**: Menyingkirkan nuansa warna ungu/AI dari sidebar dan menggantinya dengan tema metalik *Slate & Sapphire Blue* premium.

---

*Generated: 06 Jun 2026 · Corporate Web Ops (Updated)*
