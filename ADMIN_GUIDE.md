# CMS Administrator & Operations Guide

Welcome to the **Juli Club Lucknow CMS Administrator Guide**. This document outlines how to use and operate all administration modules, manage team permissions, edit site content, customize page layouts visually, configure SEO, and perform white-label rebranding.

---

## 🔑 Accessing the Admin Portal

1. Open the website on desktop or mobile.
2. Click the floating **"CMS Admin Portal"** badge in the bottom-left corner (or navigate to the `/admin` path).
3. Log in using authorized credentials.

### Default Super Admin Credentials
- **Email**: `admin@juliclub.com`
- **Password**: `admin123`

---

## 👥 Roles & Permissions Engine (RBAC)

The system supports 4 granular user roles with module access enforcement:

| Module | Super Admin | Admin | Editor | Content Writer |
| :--- | :---: | :---: | :---: | :---: |
| **Dashboard** | ✅ | ✅ | ✅ | ✅ |
| **Homepage CMS** | ✅ | ✅ | ✅ | ❌ |
| **Visual Builder** | ✅ | ✅ | ✅ | ✅ |
| **Location Pages** | ✅ | ✅ | ✅ | ❌ |
| **Companion Profiles** | ✅ | ✅ | ✅ | ✅ |
| **Blog & News** | ✅ | ✅ | ✅ | ✅ |
| **Media Library** | ✅ | ✅ | ✅ | ✅ |
| **Enterprise SEO** | ✅ | ✅ | ✅ | ❌ |
| **Reviews & Ratings** | ✅ | ✅ | ✅ | ✅ |
| **FAQ Accordion** | ✅ | ✅ | ✅ | ✅ |
| **White Label CMS** | ✅ | ✅ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ | ❌ |
| **Activity Logs** | ✅ | ✅ | ❌ | ❌ |
| **Backup & Restore** | ✅ | ✅ | ❌ | ❌ |

---

## 🛠️ Modules Breakdown

### 1. Dashboard Overview
Provides live metrics on companion profile counts, active location pages, blog articles, client reviews, pending media uploads, system health status, and quick shortcuts.

### 2. Homepage CMS
Edit Hero headlines, trust badges, WhatsApp call-to-action buttons, companion grid headers, Lucknow rate card pricing, local area coverage maps, and footer legal text.

### 3. Visual Page Builder (Elementor Lite v1.0)
- **Drag & Reorder**: Rearrange homepage section blocks using up/down arrow buttons.
- **Toggle Visibility**: Hide or show individual section blocks with a single click.
- **Section Property Inspector**: Change section titles, subtitles, vertical padding (`py-8`, `py-16`, `py-24`), background tones, and custom CTA button text & links.
- **Device Viewport Simulation**: Toggle between Desktop, Tablet, and Mobile preview modes.
- **Preset Templates**: Instantly apply preset layouts such as *High-Conversion SEO*, *Minimalist VIP Directory*, or *Content Focus*.

### 4. Location Pages Manager
Manage area-specific companion landing pages for Lucknow sub-localities (Hazratganj, Gomti Nagar, Indira Nagar, Alambagh, Charbagh, Chowk, Mahanagar, Sushant Golf City). Edit custom meta titles, area bios, distance indicators, and neighborhood landmark details.

### 5. Companion Profiles CMS
Add, edit, publish, or delete VIP escort profiles. Modify name, age, category (VIP Celebrity, College Model, Corporate, High Society, Foreigner), rates (1 Hour, 3 Hours, Full Night), photos, height, bust size, languages, availability status, and bio text.

### 6. Blog & Content CMS
Publish SEO-focused local lifestyle articles, escort guides, and safety tips. Includes full rich content editing, tags, categories, estimated reading times, and thumbnail URL management.

### 7. Media Library
Upload, organize, tag, crop preview, replace, and delete image assets. Includes instant image URL copying for seamless embedding into profiles or blog posts.

### 8. Enterprise SEO Manager
Configure global site meta title formats, meta descriptions, canonical domain URLs, Open Graph images, Twitter Cards, XML Sitemap generators (`/sitemap.xml`), robots.txt directives, and JSON-LD Schema structured data.

### 9. Reviews & Testimonials
Moderate client ratings and reviews. Add new verified reviews, edit rating scores (1-5 stars), set reviewer names, location tags, and publish status.

### 10. White Label Engine
Rebrand the platform without writing code:
- **Brand Identity**: Site title, slogan, target domain, logo URL.
- **Color Accent Presets**: Imperial Gold, Royal Sapphire, Emerald Reserve, Rose Velvet, Purple Sovereign.
- **Routing**: Contact phone, WhatsApp numbers, support email.
- **Import/Export Config**: Download white-label JSON configurations to deploy matching branded portals.

### 11. Backup & Restore
Generate instant JSON database backups. Create automatic rollback snapshots before major edits or restore previous site configurations with a single click.
