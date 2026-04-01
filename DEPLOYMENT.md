# 🚀 Deployment Guide - Luxury Stay

This guide will walk you through deploying the **Luxury Stay** application.
We will deploy the **Backend** to **Render** and the **Frontend** to **Vercel**.

---

## 📋 Prerequisites

1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
4.  **MongoDB Database**: You need a cloud-hosted MongoDB (e.g., MongoDB Atlas).

---

## ☁️ Part 0: Database Setup (MongoDB Atlas)

**You do NOT need to keep your PC running.** We will use a free cloud database.

1.  **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** and sign up (Free).
2.  **Create a Cluster**:
    *   Select **Shared** (Free) tier.
    *   Choose a provider (AWS) and region (e.g., Singapore).
    *   Click **"Create Cluster"**.
3.  **Create a Database User**:
    *   Go to **Database Access** -> **"Add New Database User"**.
    *   Authentication Method: **Password**.
    *   Enter a **Username** and **Password** (Save these!).
    *   Role: "Read and write to any database".
    *   Click "Add User".
4.  **Network Access**:
    *   Go to **Network Access** -> **"Add IP Address"**.
    *   Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
    *   Click "Confirm".
5.  **Get Connection String**:
    *   Go to **Database** -> Click **"Connect"**.
    *   Select **"Drivers"**.
    *   Copy the string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`).
    *   **Replace `<username>` and `<password>`** with the ones you created in Step 3.
    *   **Save this URL.** You will need it for Render.

---

## 🛠️ Part 1: Deploy Backend (Render)

1.  **Log in to Render** and click **"New +"**.
2.  Select **"Web Service"**.
3.  **Connect your GitHub repository** (`LuxuryStay`).
4.  **Configure the Service**:
    *   **Name**: `luxury-stay-backend` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt).
    *   **Branch**: `main` (or your working branch).
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn -k uvicorn.workers.UvicornWorker server:app`
    *   **Instance Type**: `Free`

5.  **Environment Variables** (Click "Advanced" or "Environment"):
    Add the following keys and values:
    *   `PYTHON_VERSION`: `3.10.12` (or similar)
    *   `MONGO_URL`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority` (Your Cloud MongoDB URL)
    *   `DB_NAME`: `luxury_stay`
    *   `BOOKING_API_KEY`: (Optional, leave blank for Mock Mode)

6.  Click **"Create Web Service"**.
    *   Render will start building your app. This may take a few minutes.
    *   Once finished, you will see a URL like `https://luxury-stay-backend.onrender.com`. **Copy this URL.**

---

## 🎨 Part 2: Deploy Frontend (Vercel)

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import your GitHub repository**.
3.  **Configure Project**:
    *   **Framework Preset**: Create React App (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Build and Output Settings**:
    *   Leave default (`npm run build`).
5.  **Environment Variables**:
    *   Key: `REACT_APP_BACKEND_URL`
    *   Value: The Render URL you copied earlier without the trailing slash (e.g., `https://luxury-stay-backend.onrender.com`).
6.  Click **"Deploy"**.
    *   Vercel will build and deploy your frontend.
    *   Once complete, you will get a domain like `https://luxury-stay.vercel.app`.

---

## 🔗 Part 3: Final Connection

1.  **Update Backend CORS (Optional but Recommended)**:
    *   Go back to your **Render** dashboard.
    *   Add a new environment variable:
        *   `CORS_ORIGINS`: `https://luxury-stay.vercel.app` (Your new Vercel domain).
    *   Render will automatically restart the server.

2.  **Test the Application**:
    *   Open your Vercel URL.
    *   Try searching for hotels and making a booking.
    *   Everything should work smoothly!

---

## 🐛 Troubleshooting

*   **Backend Build Failed?**
    *   Check the logs on Render. Ensure `requirements.txt` is inside the `backend` folder.
*   **"Network Error" on Frontend?**
    *   Ensure `REACT_APP_BACKEND_URL` is set correctly in Vercel **without** a trailing slash.
    *   Check if the Backend is "Live" on Render (the free tier sleeps after inactivity; wait 30s for it to wake up).
*   **Database connection fails?**
    *   Ensure your MongoDB Atlas IP Access List includes `0.0.0.0/0` (Allow from Anywhere) to let Render connect.
