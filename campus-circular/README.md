# Campus Circular — From Ownership to Access

> Why buy what someone nearby already has? A trusted campus sharing platform for Ayush ↔ Tejas.

Frontend-only React hackathon project — discover, share, lend, borrow, donate resources with AI-assisted discovery, deposits, lifecycle, and pinpoint maps.

**Live Demo:** Netlify auto-deploys from `master` (see `netlify.toml` — SPA `_redirects` included)  
**Stack:** React 19 + React Router 7 + Framer Motion + Leaflet + Recharts + Font Awesome 6.5.2 + Dicebear 9.x

### Quick Start
```bash
cd campus-circular
npm install
npm start # http://localhost:3000
npm run build # → build/
```

### Demo Accounts
- Student: `ayush@college.edu` / `campus123` (Ayush) or `tejas@college.edu` / `campus123` (Tejas)
- Admin: `admin` / `admin123`

### Features
- 50 items (CC001–CC050) with categories, condition, pinpoint map, public/private, donate/borrow
- AI search (typo-tolerant `camra → camera`), smart matching, compare 2
- Borrowing: hourly/daily, deposit refundable/non-refundable/partial (decided post-return), agreement, 10-step lifecycle with live timeline
- My Listings & My Exchanges (Lending vs Borrowing split, owner controls delete)
- Reviews (live to admin analytics), impact dashboard, admin panel

### Project Structure
```
campus-circular/
  public/_redirects  # SPA fix for Netlify
  src/
    components/LocationMap|Picker|DiscoverMap
    context/AppContext.js # localStorage persistence (cc_*)
    data/mockData.js # 50 resources + users
    pages/* + admin/*
    utils/cardVisual.js
```

### Deploy (Netlify)
Base: `campus-circular`, Build: `npm run build`, Publish: `build` — see `netlify.toml`.

### Repo
Renamed from `scampus` → **campus-circular**: `https://github.com/projectsbyayush/campus-circular`
