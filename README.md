# 👁️ KANNPEELI (കൺപീലി): The Ultimate Ocular Quantification & Cinema Meme Doppelgänger System

> **A project for TinkerHub 3.0 Useless Projects Hackathon**  
> *"Counting things nobody ever asked us to count."*

---

## 🌟 The Vision
Have you ever looked in the mirror and asked yourself:  
- *"How many individual eyelashes do I have on my left eye versus my right eye?"*  
- *"Which iconic Malayalam cinema meme shares my exact ocular geometry?"*  
- *"Am I Dashamoolam Damu, Shammi, Manavalan, or Nagavalli?"*

Probably not. **Until KANNPEELI.**

**KANNPEELI (കൺപീലി)** is an entirely unnecessary, delightfully pseudo-scientific computer-vision web application that counts your eyelashes, computes your bilateral symmetry, and matches your facial gaze with iconic Malayalam cinema meme legends.

---

## ✨ Features

- **🎨 Official Kannpeeli Emblem:** Custom stylized artistic eyelash eye logo.
- **🎭 Cinema Meme Doppelgänger Matcher:**
  - **Dashamoolam Damu** (*Chattambinadu*): *"Enne thallalle ammove... ith ente natural peeliya!"* (High Suspicion / Nervous Blink)
  - **Shammi** (*Kumbalangi Nights*): *"Shammi hero aada... hero!"* (Terrifyingly Symmetrical Unblinking Stare)
  - **Manavalan** (*Pulival Kalyanam*): *"Dubai-il ithokke regular peeliya!"* (High Lash Volume & Pure Swag)
  - **Nagavalli** (*Manichitrathazhu*): *"Vidamaatte? Pure Ocular Drama!"* (Extreme Drama Index > 75%)
  - **Aadu Thoma** (*Spadikam*): *"Ray-Ban vechu nokkiyatha... Mass!"* (Asymmetrical Ocular Rebellion)
  - **Ramanan** (*Punjabi House*): *"Mudalali... idhellam kanakkano?!"* (Sparse Aerodynamic Lashes)
  - **Kumbidi** (*Nandanam*): *"Evide nokkiyaalum Kumbidi!"* (Mysterious Unpredictable Gaze)
- **🔬 Morphological Follicle Quantification:** Uses OpenCV Haar cascades and Blackhat morphology to isolate eyelash contours along ocular margins.
- **⚖️ Bilateral Disparity Counter:** Quantifies how many lashes reside on your left eye vs right eye.
- **🏛️ The Public Record:** Neo-brutalist live leaderboard with rankings (`01`, `02`), progress bars, and tier tags (`elite`, `solid`, `modest`).

---

## 🚀 Quickstart Guide

### 1. Start the Backend (FastAPI)
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
- Open in browser: `http://localhost:5173`

---

## 📁 Adding Custom Meme Images
To customize the movie memes with your own photos or stills:
Simply drop image files into:
`frontend/public/memes/`
(e.g., `damu.svg`, `shammi.svg`, `manavalan.svg`, `nagavalli.svg`, `aadu_thoma.svg`, `ramanan.svg`, `kumbidi.svg` or `.png`/`.jpg`).

---

## 🌐 Deployment Guide

### Option 1: All-in-One on Render (Recommended, Free & Simplest)
You can deploy both the Frontend and Backend together on a single free Render Web Service:

1. Push this project to **GitHub**.
2. Go to [render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following options:
   - **Environment**: `Python`
   - **Build Command**:
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
5. Click **Create Web Service**.
6. Once deployed, Render will provide a live HTTPS URL (e.g. `https://kannpeeli.onrender.com`). Both the web app and the AI scanner will work instantly!

---

### Option 2: Split Deploy — Vercel (Frontend) + Render / Railway (Backend)

#### Step 1: Deploy Backend (Render / Railway)
1. In Render/Railway, create a new Web Service pointing to the repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to:
   ```bash
   pip install -r requirements.txt
   ```
4. Set **Start Command** to:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Note your backend URL (e.g. `https://kannpeeli-api.onrender.com`).

#### Step 2: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Set **Root Directory** to `frontend`.
4. In **Environment Variables**, add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://kannpeeli-api.onrender.com` *(your backend URL from Step 1)*
5. Click **Deploy**. Vercel will give you a blazing fast global CDN URL (e.g. `https://kannpeeli.vercel.app`).

---

### Option 3: Docker Deployment (Railway, Fly.io, Cloud Run, or VPS)
A multi-stage `Dockerfile` is already included in the project root:

```bash
# Build the Docker image
docker build -t kannpeeli .

# Run the container locally or on your server
docker run -p 8000:8000 kannpeeli
```
Then open `http://localhost:8000`.

