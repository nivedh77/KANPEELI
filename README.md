# 👁️ KANNPEELI — Advanced Eyelash Quantification System

> The world didn't need this. We built it anyway.

KANNPEELI is an intentionally useless AI-powered computer-vision system that detects, analyzes, and counts eyelashes from a camera feed or uploaded image.

It combines computer vision, a playful ocular-analysis interface, cinematic eye references, rankings, and completely unnecessary scientific metrics to answer humanity's most important unanswered question:

**"How many eyelashes do I have?"**

---

## 👥 Team

### Team Name
**STRANGERS**

### Team Members

- **Team Lead:** Nivedh M — Cochin University of College of Engineering Kuttanad
- **Member 2:** Rashmi Krishna P — Cochin University of College of Engineering Kuttanad

---

# 📝 Project Description

KANNPEELI is an advanced AI-powered system that uses computer vision to detect, analyze, and count your eyelashes.

It provides sophisticated-looking statistics, ocular analysis, cinema-eye comparisons, rankings, and completely unnecessary scientific conclusions about your eyes.

---

# 🤨 The Problem (that doesn't exist)

Humanity has successfully counted people, stars, cells, grains of sand, and countless other things.

But somehow...

**Nobody knows exactly how many eyelashes they have.**

This unacceptable lack of information has left millions of people living in uncertainty.

KANNPEELI exists to fix this extremely serious problem.

---

# 💡 The Solution (that nobody asked for)

KANNPEELI uses computer vision to scan your eyes, isolate the ocular region, estimate/count eyelashes, and generate an unnecessarily detailed report.

The system calculates completely legitimate-sounding metrics such as:

- Ciliary Population
- Bilateral Symmetry
- Lash Density
- Suspicion Index
- Eye Drama Index
- Ciliary Geometry

It also lets users compare their eyes with iconic cinema-eye references and compete on a public lash leaderboard.

**No important information is produced.**

---

# 🛠️ Technical Details

## For Software

### Languages Used

- JavaScript
- Python
- HTML
- CSS

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- Uvicorn

### Computer Vision / Data Processing

- OpenCV
- NumPy
- Image processing techniques

### Libraries / Packages

- `opencv-python`
- `numpy`
- `fastapi`
- `uvicorn`
- `python-multipart`

### Tools Used

- VS Code / Antigravity IDE
- Git
- GitHub
- Google Chrome
- Python
- Node.js
- npm

--- ### Screenshots
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44.jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(1).jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(2).jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(1).jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(3).jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(4).jpeg
https://raw.githubusercontent.com/nivedh77/KANPEELI/refs/heads/main/WhatsApp%20Image%202026-09-12%20at%2018.16.44%20(5).jpeg


Video: https://drive.google.com/file/d/1__DK6vtrDpCmI2RidWFTJl-33aVD8eg2/view?usp=drivesdk

 Implementation

## For Software:

KANNPEELI consists of a React-based frontend and a Python-based computer vision backend.

The frontend provides the interactive user interface, camera experience, scanning animations, results, cinema-eye archive, and lash leaderboard.

The backend handles image processing and computer vision operations using Python, OpenCV, NumPy, and the project's eyelash detection and analysis modules.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/nivedh77/KANPEELI.git
cd KANPEELI

2. nstall backend dependencies
cd backend
pip install -r requirements.txt
3. Install frontend dependencies

Open another terminal:

cd frontend
npm install
Run
Start the Backend

From the backend directory:

uvicorn main:app --reload

The backend will start locally.

Start the Frontend

From the frontend directory:

npm run dev

Open the local URL shown by Vite in your browser.

Project Documentation
For Software:
Screenshots
1. KANNPEELI Ocular Radar

Caption: The KANNPEELI homepage featuring the interactive Ocular Radar, live eye tracking, scanning presets, and the intentionally serious presentation of an entirely unnecessary technology.

2. Eyelash Scanner

Caption: The evidence submission and scanning interface where users can launch the camera scanner or upload an image for eyelash analysis.

3. Cinema Eye Archives

Caption: The Cinema Ocular Archives, where users can compare their ocular characteristics with legendary cinema-inspired eye profiles.

4. Lash Rankings

Caption: The public Lash Rankings showing users competing for the completely meaningless achievement of having the highest number of eyelashes.

5. Official Submission

Caption: The official KANNPEELI submission section where users can submit their eyelash count and claim their completely unnecessary certificate.

Diagrams

Caption: KANNPEELI workflow showing the process from camera/image input to eye detection, image processing, eyelash analysis, metric generation, and final humorous report.



# 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │       USER          │
                 │ Camera / Image      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   REACT FRONTEND    │
                 │                     │
                 │ Camera Scanner      │
                 │ Image Upload        │
                 │ Analysis Dashboard  │
                 │ Leaderboard         │
                 └──────────┬──────────┘
                            │
                            │ HTTP API
                            ▼
                 ┌─────────────────────┐
                 │    FASTAPI SERVER   │
                 │                     │
                 │ Image Processing    │
                 │ Analysis Engine     │
                 │ Eyelash Detection   │
                 │ Roast Engine        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   OPENCV + NUMPY    │
                 │                     │
                 │ Eye Region Analysis │
                 │ Image Processing    │
                 │ Lash Estimation     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      RESULTS        │
                 │                     │
                 │ Lash Count          │
                 │ Symmetry             │
                 │ Drama Index         │
                 │ Cinema Eye Match    │
                 └─────────────────────┘
