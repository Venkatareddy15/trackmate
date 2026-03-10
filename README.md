# 🚗 TrackMate: Premium Mobility Platform

A premium, full-stack mobility application built with the MERN stack (MongoDB, Express, React, Node.js). Featuring real-time route optimization, secure payments, and a futuristic UI/UX.

## ✨ Features

- **Dynamic Route Optimization**: Leverages Google Maps API with real-time traffic data for accurate distance and ETA estimates.
- **Role-Based Dashboards**: 
  - **Travellers**: Publish rides, manage routes, and view live bookings.
  - **Passengers**: Discover rides near their route and secure bookings via a dedicated authorization portal.
- **Secure Authorization System**: Integrated payment simulation with a live route summary map during checkout.
- **Real-Time Synergy**: Socket.io integration for instant notifications and sync across the mobility grid.
- **Premium Aesthetics**: Built with a "Physical Glass" design system, custom micro-animations (Framer Motion), and responsive layouts.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React, Leaflet (React-Leaflet).
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT Authentication.
- **Mapping**: Google Maps Distance Matrix, Directions, and Geocoding APIs.

## 🚀 Quick Start

### 1. Prerequisite
Ensure you have the following environment variables in your `.env` files or deployment dashboard:
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_CLIENT_ID` (For Google Sign-In)
- `VITE_API_URL` (Frontend needs this to point to the backend)

### 2. Deployment (Netlify)
The project is optimized for Netlify deployment.
- **Frontend**: Deployed at `https://trackmate-rs.netlify.app`
- **Configuration**: Managed via `netlify.toml` in the root directory.

### 🔒 Fixing Google OAuth (Error 400: redirect_uri_mismatch)
To prevent this error, you must register your live Netlify URL in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
1.  **Authorized JavaScript origins**: Add `https://trackmate-rs.netlify.app`
2.  **Authorized redirect URIs**: Add `https://trackmate-rs.netlify.app`
3.  **Wait**: It can take 5-10 minutes for Google to update.

## 🔒 Security
- **JWT Protection**: Secure state-based authentication.
- **Encryption**: PCI-DSS compliant payment simulation architecture.

---
Built with ⚡ by [ZET-Technologies](https://github.com/ZET-Technologies-Private-Limited)
