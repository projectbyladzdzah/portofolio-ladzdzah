# Ladzdzah — Official F1 Driver Profile & Portfolio (Charles Leclerc Style)

A high-performance Formula 1-inspired digital portfolio and telemetry hub built with **Node.js, TypeScript, React 18, Vite, and Tailwind CSS v3**, modeled directly after the official Formula 1 driver profile page for **Charles Leclerc** (`https://www.formula1.com/en/drivers/charles-leclerc`).

Includes a comprehensive, reactive **Admin Control Room (CMS)** allowing 100% live customization of every section on the website, persistent browser storage, PIN security clearance, and JSON backup/restore.

---

## 🏎️ F1 Charles Leclerc Design Highlights

- **Official F1 Driver Hero Presentation**:
  - Oversized racing watermark number (e.g. `#16`).
  - Country flag (🇮🇩 Indonesia) & Driver title.
  - Driver First Name (`LADZDZAH`) and Last Name / Discipline in bold F1 racing typography.
  - Official F1 Team Slash Badge (`TELKOM SCUDERIA // INDEPENDENT`).
  - Cutout driver portrait framed with racing corner brackets and telemetry gauges.
- **Signature F1 Driver Career Stats (2x4 Grid)**:
  - Exact layout as seen on `formula1.com/en/drivers/charles-leclerc`:
    - `TEAM` • `COUNTRY` • `PODIUMS` • `POINTS`
    - `GRANDS PRIX ENTERED` • `WORLD TITLES` • `HIGHEST RACE FINISH` • `BASE / HOMETOWN`
- **Running Telemetry Ticker**:
  - High-speed racing marquee with F1 red star separators.
- **Official F1 Biography Section**:
  - Signature pull quote box with racing red bent rule.
  - Multi-paragraph career narrative and interactive technical skills arsenal.
- **Trackside Portfolio Grid**:
  - Cards styled identically to official F1 news and feature articles with category chips (`WEB SYSTEM`, `VISUAL`, `OPERATIONS`), season tags, and inspect telemetry indicators.
  - **Project Telemetry Modal**: Clicking any card reveals a full pop-up with project screenshot, tags, description, live demo link, and source code link.
- **Career History Table**:
  - Season-by-season breakdown tracking years, teams, roles, and status.
- **Championship Podiums & Awards**:
  - F1 gold podium cards honoring 1st place martial arts championships and achievements.
- **Pit Wall Communications**:
  - F1 team radio contact panel with direct links for Email, WhatsApp, GitHub, LinkedIn, and operating base.

---

## ⚙️ Integrated Admin Control Room (CMS)

Open the Control Room anytime by clicking **`CONTROL ROOM ⚙`** in the header or via the edit buttons on the page.

1. **🏁 HERO & DRIVER**: Driver number, flag, first & last name, team badge, quote, bio summary, driver photo upload (auto-compressed with HTML5 canvas) or URL, and the signature 2x4 career stats grid.
2. **👤 BIOGRAPHY**: Heading, pull-quote, author signature, biography paragraphs, and technology tags.
3. **🏎️ PORTFOLIO PROJECTS**: Full CRUD (Create, Read, Update, Delete) for portfolio projects with category selector, year, tags, live URL, GitHub URL, image upload, and Featured Project toggle.
4. **⏱️ CAREER HISTORY**: Full CRUD for career and organization history (year, team, role, points, description).
5. **📊 TICKER**: Custom marquee keywords.
6. **🏆 PODIUMS & AWARDS**: Full CRUD for championship medals and competition achievements.
7. **📡 PIT COMMS**: Contact headline, email, phone/WhatsApp, GitHub, LinkedIn, and base location.
8. **💾 BACKUP & SECURITY**:
   - **PIN Security Lock**: Optional PIN protection for the Control Room (Default PIN: `1234`).
   - **Download Backup (Export JSON)**: 1-click download of all website data into a `.json` backup file.
   - **Restore Data (Import JSON)**: Upload a backup JSON file to sync across devices or restore data.
   - **Factory Reset**: Revert the website back to default settings at any time.

---

## 💻 Tech Stack

- **Runtime & Tooling**: Node.js, Vite 6
- **Language**: TypeScript (strict mode, fully typed interfaces)
- **UI Library**: React 18
- **Styling**: Tailwind CSS v3.4 (JIT compiler, custom F1 color palette, racing cuts)
- **Icons**: Lucide React
- **Persistence**: Reactive React Context + Browser LocalStorage + Canvas image compression

---

## 🚀 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production Hosting**:
   ```bash
   npm run build
   ```
   This generates an optimized static build in the `dist/` directory.

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🌐 Ready for Production Hosting

The output in the `dist/` folder is 100% static and optimized for zero-config deployment on:
- **Vercel** (connect GitHub repository or run `vercel`)
- **Netlify** (drag & drop `dist` or connect repository)
- **Cloudflare Pages**
- **GitHub Pages**
- **Surge / Firebase Hosting / Any VPS**
