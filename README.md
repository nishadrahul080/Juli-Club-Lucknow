# Juli Club Lucknow - Enterprise Companion Directory & Custom CMS (v1.0.0)

[![Version](https://img.shields.io/badge/version-1.0.0-gold.svg)](https://github.com)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8.svg)](https://tailwindcss.com/)

An enterprise-grade, high-conversion single-page application and custom headless CMS tailored for premier companion services, location-based landing directories, and automated SEO optimization. Built for Lucknow area coverage with 100% Cash on Delivery & Zero Advance Payment trust badges.

---

## 🌟 Key Highlights

- **Dynamic Public Directory Frontend**: High-converting, responsive luxury dark-mode theme featuring verified companion profile grids, area coverage maps, tariff rate cards, local Lucknow SEO content blocks, and client reviews.
- **Enterprise Headless Admin CMS**: Comprehensive admin portal featuring Role-Based Access Control (RBAC), multi-user management, and live website state synchronization.
- **Visual Page Builder (Elementor Lite v1.0)**: Drag-and-drop block ordering, vertical padding controls, background tone selectors, custom CTA buttons, and device preview toggles (Desktop / Tablet / Mobile).
- **White Label Engine**: Rebrand site title, domain, logo, contact phone, WhatsApp routing, copyright notices, and custom accent color palettes without writing code.
- **Dynamic Location Pages Engine**: Dedicated high-ranking SEO landing pages for key Lucknow localities (Hazratganj, Gomti Nagar, Indira Nagar, Alambagh, Charbagh, Chowk, Mahanagar, Sushant Golf City).
- **Enterprise SEO & Meta Manager**: Automated Open Graph tags, Twitter cards, canonical URLs, XML sitemap generation, robots.txt management, and structured JSON-LD schema markup.
- **Media Library & Asset Manager**: Built-in asset manager with drag-and-drop file uploads, image cropping preview, image replacement, tags, and direct URL copy features.
- **Blog & Article CMS**: Rich article editor with categories, tags, author attribution, reading time estimation, and draft/published state management.
- **Automated Backup & Instant Restore**: JSON snapshot generation, instant rollback capability, and automated daily database snapshotting.
- **Custom 404 & Error Resilience**: Luxury styled 404 page with quick navigation back to verified profiles and location pages.

---

## 🚀 Tech Stack

- **Frontend Framework**: React 18 (TypeScript) with Vite
- **Styling & UI**: Tailwind CSS, Lucide React Icons
- **State & Data Management**: React Context API (`CMSContext`) with persistent LocalStorage state engine
- **Routing**: Single Page Application dynamic view routing with custom browser history pushstate
- **Animation**: Motion & CSS transitions
- **Build System**: Vite + TypeScript (`tsc`) with zero linting/build errors

---

## 📂 Project Structure

```
├── src/
│   ├── admin/                 # Enterprise Admin Portal
│   │   ├── components/        # Admin Layout, Navigation, Top Bar
│   │   ├── modules/           # Module Views (Dashboard, Profiles, Locations, SEO, Media, Visual Builder, White Label, etc.)
│   │   ├── pages/             # Admin Dashboard & Login Pages
│   │   └── utils/             # Permissions Engine & RBAC definitions
│   ├── components/            # Public Website Components (Hero, Profiles, RateChart, ContentBlocks, Reviews, FAQ, Navbar, Footer, WhatsApp Floating Button)
│   ├── context/               # CMSContext & Data Provider
│   ├── pages/                 # Public Pages (HomePage, LocationPage, ProfileDetailPage, BlogPage, BlogPostPage, NotFoundPage)
│   ├── types.ts               # Shared TypeScript Interfaces & Data Definitions
│   ├── App.tsx                # Main App Router & Mode Switcher
│   └── main.tsx               # Entry Point
├── metadata.json              # Platform Application Manifest
├── README.md                  # Overview & Documentation
├── INSTALL.md                 # Setup & Installation Guide
├── ADMIN_GUIDE.md             # Administrator & User Operations Guide
├── CHANGELOG.md               # Version History & Release Notes
└── PROJECT_ARCHITECTURE.md    # Technical Architecture & Data Pipeline
```

---

## 🔐 Admin Portal Credentials

- **URL**: Click the floating **"CMS Admin Portal"** badge in the bottom-left corner of the website.
- **Super Admin Credentials**:
  - **Email**: `admin@juliclub.com`
  - **Password**: `admin123`

---

## 📄 License

© 2026 Juli Club Lucknow. All rights reserved.
