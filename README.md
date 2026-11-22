# 🍕 PizzaHub — Client Web Application (Next.js 14 App Router)

A modern, responsive, role-based food ordering platform built for **PizzaHub — Pizza Ordering & Delivery Platform**. Customers explore artisan pizzerias, customize pizza orders, and track deliveries. Restaurants (vendors) publish menu items, manage incoming customer orders, and subscribe to Premium with Stripe. Admins monitor user permissions, manage menu catalog items, and view immutable transaction audits.

---

## 📌 Project Overview
- **Project Name:** PizzaHub — Pizza Ordering & Delivery Platform (Client)
- **Role Support:** Admin, Vendor (Restaurant Owner), Customer
- **Architecture:** Next.js 14 App Router, Tailwind CSS, Lucide React, Framer Motion, Next-Themes, Sonner Toast, Recharts.

---

## 🚀 Live Links & Credentials
- **Live Client Web App:** `https://pizza-hub-client.vercel.app` (or deployment URL)
- **Live Server REST API:** `https://pizza-hub-server-blond.vercel.app`
- **Client GitHub Repository:** `https://github.com/sjahanothye/PizzaHub-Client`
- **Server GitHub Repository:** `https://github.com/sjahanothye/PizzaHub-Server`

### 🔑 Test Credentials (1-Click Quick Fill on Sign-In Page)
| Role | Email | Password | Access / Plan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pizzahub.com` | `Admin123!` | Full Admin Dashboard, Manage Users, Approve Items |
| **Vendor (Free)** | `bellapizza@pizzahub.com` | `Vendor123!` | Max 3 active menu items |
| **Vendor (Premium)** | `artisancrust@pizzahub.com` | `Vendor123!` | Unlimited active items, Verified Premium Badge |
| **Customer** | `john@example.com` | `Customer123!` | Browse, Order, Cancel Pending Orders, Wishlist |
| **Customer 2** | `sarah@example.com` | `Customer123!` | Browse, Reviews, Orders |

---

## ✨ Important Features

### 1. Public Experience
- **Hero Banner:** Eye-catching pizza headlines, quick delivery badge, and animated imagery.
- **Dynamic Featured Pizzas:** Displays at least 6 approved, active database items with pricing, vendor badge, and details links.
- **Pizza Categories Explorer:** 6 distinct categories (Classic Pizzas, Vegetarian Pizzas, Meat Lovers, Gourmet Pizzas, Sides & Appetizers, Beverages & Desserts).
- **Why Choose PizzaHub:** Custom section highlighting cold-fermented dough, 100% natural mozzarella, heated delivery, and verified pizzerias.
- **How It Works & Testimonials:** 3-step visual guide and authentic reviews from pizza enthusiasts.
- **Browse Menu:** Search by name/description, filter by category and location, with loading states and empty state.

### 2. Vendor Portal
- **Overview Dashboard:** Total menu items, active items, pending orders, accepted orders, and activity charts.
- **Add Menu Item:** File upload with ImgBB integration, category, price, location, description. Free tier automatically restricts publishing beyond 3 active items.
- **My Menu Items:** View, edit modal, delete dialog, and toggle availability (Active / Inactive).
- **Customer Orders:** Real-time incoming orders with customer details, delivery date/address, and Accept/Reject actions.
- **Subscription:** Free vs Premium comparison table and direct Stripe Checkout integration ($19.99/yr).

### 3. Customer Portal
- **Overview:** Total, pending, accepted, and rejected order metrics and history chart.
- **My Orders:** View order details, cancel pending orders, and track progress.
- **Order Status Timeline:** Interactive modal displaying real-time timeline from order placed to accepted or rejected.
- **Wishlist & Favorites:** Save pizzas for quick reordering.
- **Reviews & Ratings:** Submit ratings and comments on pizza details.

### 4. Admin Portal
- **Platform Overview:** Statistics on users, vendors, customers, catalog items, pending reviews, and total revenue.
- **Manage Users:** Search and filter users by role, with instant Block/Unblock toggle.
- **Manage Menu Items:** Approve or Reject pending submissions, toggle active status, and delete items.
- **Transaction Audit:** Immutable log of vendor Stripe subscription payments with session IDs and amounts.

---

## 🛠️ Technology Stack & NPM Packages
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `^14.2.20` | React framework with App Router & server rendering |
| `react` & `react-dom` | `^18.3.1` | UI component library |
| `tailwindcss` | `^3.4.17` | Utility-first CSS styling |
| `framer-motion` | `^11.15.0` | Production-ready motion animations |
| `lucide-react` | `^0.469.0` | Clean vector iconography (includes modern X logo) |
| `next-themes` | `^0.4.4` | Dark / light theme switching |
| `sonner` | `^1.7.1` | Rich toast notifications |
| `recharts` | `^2.15.0` | Responsive charts for dashboard analytics |
| `clsx` & `tailwind-merge` | `^2.x` | Dynamic classname utilities |

---

## ⚙️ Environment Variables
Create `.env.local` in the root of the client folder:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ImgBB API Key (for file uploads)
NEXT_PUBLIC_IMGBB_API_KEY=mock_imgbb_key

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🏆 Challenge Requirements Documentation

### Challenge 1: Advanced Search and Price Sorting
- **Implementation:** Integrated in `/menu`. The search input performs case-insensitive search across pizza name, description, and location.
- **Price Sorting:** Users can sort by price in ascending (`price-asc`) or descending (`price-desc`) order. The client forwards `?sortBy=price&order=asc|desc` to the Express REST API.

### Challenge 2: JWT & Role Verification
- **Implementation:** Tokens stored securely and validated on every request via `Authorization: Bearer <token>`.
- Client route guard enforces strict role separation so users cannot manually access other roles' dashboards.

### Challenge 3: Visual Polish & Professional Pizza Theme
- **Implementation:** Professional color palette using warm pizza reds (`#dc2626`), baked crust golds (`#ea580c`), amber highlights, and creamy neutral backgrounds.
- Consistent font hierarchy, balanced card heights, smooth Framer Motion transitions, and fully responsive across mobile, tablet, and desktop.

---

## 🌟 Optional Requirements Implemented
1. **Reviews and Ratings:** Customers can rate pizzas (1-5 stars) and write comments on the pizza details page.
2. **Dark / Light Mode Toggle:** Seamless theme toggle in navbar and dashboards via `next-themes`.
3. **Order Status Timeline:** Modal stepper on customer orders page showing progression timestamps.
4. **Wishlist & Favorites:** Customers can save pizzas to their favorites and access them via the navbar and customer dashboard.

---

## 🏃 Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build & Start:**
   ```bash
   npm run build
   npm start
   ```
