# 🚀 React URL Shortener (Frontend)

This project is a **React-based frontend web application** for shortening URLs, viewing statistics, and managing shortened links.  
It provides an intuitive interface to generate shortcodes, track clicks, and manage expiration times for each link.

---

## 📌 Features

- 🔗 Shorten multiple URLs at once (up to 5 per request).  
- ⏳ Set custom validity period (default 30 minutes if empty).  
- 🆔 Optional custom shortcode support.  
- 📊 Statistics page with:
  - List of all shortened URLs
  - Click count
  - Expiry date
  - Open in new tab
  - Copy to clipboard
- 📜 Click history with referrer, timezone, and timestamps.
- 📝 Logger section to track application logs.

---

## 🛠️ Tech Stack

- **React 18**
- **Material-UI (MUI v5)** – UI components and styling
- **React Router** – for navigation (`/shorten`, `/statistics`)
- **Local Storage / Logger Utility** – to persist links & logs (simulated backend)

---

## 📂 Project Structure

url-shortener-frontend/
│── public/ # Static assets
│── src/
│ ├── components/ # Reusable UI components
│ ├── lib/ # Store & logger utilities
│ ├── pages/ # Main pages (Shorten, Stats, Redirect)
│ ├── App.js # Root component with routing
│ └── index.js # Entry point
│── package.json
│── README.md

## 📸 Screenshots

🔗 Shortener Page – Input multiple URLs with validity & shortcode.
![image](<img width="1920" height="1080" alt="Shortener" src="https://github.com/user-attachments/assets/911412d6-12b3-41eb-9fa2-3deb98bd1603" />)
📊 Statistics Page – View history, clicks, expiry, and logs.
![image](<img width="1920" height="1080" alt="Screenshot (67)" src="https://github.com/user-attachments/assets/0d126feb-28ea-4bd2-b995-b6b8592a796c" />
)
## 🧪 Testing

Verified link shortening with sample inputs:

https://www.google.com → /goog

https://www.github.com → /git1

https://www.npmjs.com → auto shortcode /a1b2c3

Checked expiry mechanism and click logging.

## 🏗️ Design Decisions

Chose React + MUI for fast development with a modern UI.

Used local storage to simulate backend persistence for links & stats.

Adopted a modular structure (pages/, components/, lib/) for scalability.

Followed ESLint rules for clean and maintainable code.

## 🔧 Installation & Setup

Clone the repository and install dependencies:

```bash
# Clone the repo
git clone https://github.com/<your-username>/url-shortener-frontend.git

# Navigate to folder
cd url-shortener-frontend

# Install dependencies
npm install

# Start development server
npm start

The app will run on http://localhost:3000

# 📜 License

This project is for educational & evaluation purposes only.
Feel free to fork and improve. 🚀
