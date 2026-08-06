# Technical Project Architecture

This document provides a detailed overview of the system architecture, state management pipeline, component topology, and data flows of the **Juli Club Lucknow CMS** application.

---

## 🏗️ Architecture Overview

The system is designed as a high-performance single-page web application featuring an embedded headless Content Management System (CMS).

```
+-------------------------------------------------------------------+
|                           USER BROWSER                            |
+-------------------------------------------------------------------+
|  +---------------------------+     +---------------------------+  |
|  |     PUBLIC FRONTEND       |     |     HEADLESS CMS ADMIN    |  |
|  | (HomePage, Locations,     |     | (Dashboard, Builder,      |  |
|  |  Profiles, Blogs, 404)    |     |  SEO, Media, WhiteLabel)  |  |
|  +-------------+-------------+     +-------------+-------------+  |
|                |                                 |                |
|                +----------------+----------------+                |
|                                 |                                 |
|                    +------------v------------+                    |
|                    |     REACT CONTEXT API   |                    |
|                    |      (CMSContext.tsx)   |                    |
|                    +------------+------------+                    |
|                                 |                                 |
|                    +------------v------------+                    |
|                    |   LOCALSTORAGE ENGINE   |                    |
|                    | (juli_cms_data_v1 /     |                    |
|                    |  juli_cms_builder_secs) |                    |
|                    +-------------------------+                    |
+-------------------------------------------------------------------+
```

---

## 🧱 Core Modules & Data Layer

### 1. Central CMS Provider (`src/context/CMSContext.tsx`)
- Maintains the canonical state of the application including site settings, homepage sections, companion profiles, location landing pages, blog articles, media items, client reviews, FAQ items, and activity logs.
- Automatically handles initialization from default seeding structures when LocalStorage is empty.
- Exposes update helper methods: `updateSettings`, `updateHomepageSections`, `updateProfiles`, `updateLocations`, `updateBlogs`, `updateMedia`, `updateReviews`, `updateFaqs`.

### 2. Public Rendering Engine (`src/components/PublicSectionRenderer.tsx`)
- Reads the ordered `sections` array from `CMSContext` or LocalStorage.
- Dynamically maps section types (`hero`, `profiles`, `map`, `rates`, `content`, `blog`, `reviews`, `faq`) to optimized UI components.
- Applies custom visual parameters configured in the Visual Page Builder (padding, background tone, custom CTA buttons).

### 3. Role-Based Access Control (`src/admin/utils/permissions.ts`)
- Defines explicit authorization matrix mapping `UserRole` (`Super Admin`, `Admin`, `Editor`, `Content Writer`) to accessible `CMSModuleId` modules.
- Hides unauthorized navigation tabs and prevents direct routing to restricted admin views.

---

## 🎨 Design System & Responsiveness

- **Primary Colors**: Dark luxury atmosphere featuring Deep Onyx `#0a0a0a`, Elevated Charcoal `#141414`, and Imperial Gold `#c5a059`.
- **Typography**: Playfair Display for headers and Plus Jakarta Sans for body typography.
- **Icons**: Lucide React iconography.
- **Breakpoints**: Mobile-first responsive grid using standard Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`).

---

## 🔒 Security & Performance Considerations

- **Input Sanitization**: All user inputs in the CMS are sanitized prior to context storage.
- **Client-Side Auth Persistence**: Session token verification for admin routes.
- **Zero Heavy Dependencies**: Pure React with Tailwind CSS ensuring fast initial page loads and cold container boots.
