
<div align="center">

  <h1>🍔 Foodiexpress</h1>
  <p><strong>A modern, full-stack food ordering and delivery web application designed for speed, scale, and seamless user experience.</strong></p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-endpoints">API Endpoints</a> •
    <a href="#-contributing">Contributing</a>
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/status-active-success.svg" alt="Project Status" />
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </p>

</div>

<br>

---

## 🚀 Overview

**Foodiexpress** is a robust food-tech platform engineered to bridge the gap between hungry customers, local restaurants, and delivery partners. Built with performance and scalability in mind, it provides real-time tracking, seamless cart management, and a secure checkout flow.

---

## 🌟 Key Features

* **User Authentication & Authorization:** Secure registration and login flows using JWT (JSON Web Tokens) with encrypted password hashing.
* **Dynamic Restaurant & Menu Browsing:** Filter restaurants by cuisine, ratings, and delivery times with a lightning-fast search interface.
* **Interactive Cart & Checkout:** Real-time quantity updates, promo code application, and integrated payment gateways.
* **Order Tracking Dashboard:** Live status updates from order placement to doorstep delivery.
* **Responsive UI/UX:** Mobile-first design philosophy ensuring optimal performance across smartphones, tablets, and desktops.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js / Next.js *(adjust based on your exact stack)*
* **Styling:** Tailwind CSS / Styled Components
* **State Management:** Context API / Redux Toolkit

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB / PostgreSQL with Mongoose / Prisma ORM
* **Authentication:** bcryptjs, jsonwebtoken

---

## 📂 Project Structure

```text
foodiexpress/
├── client/                 # Frontend application (React/Next.js)
│   ├── public/             # Static assets and icons
│   └── src/                # Components, pages, contexts, and styles
├── server/                 # Backend application (Node.js/Express)
│   ├── controllers/        # Request business logic handlers
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoint definitions
│   └── middleware/         # Auth and error-handling middleware
└── README.md
```

---

## ⚙️ Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* **Node.js** (v16+ recommended)
* **npm** or **yarn**
* **MongoDB** (local instance or MongoDB Atlas URI)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/prathameshsutar140/Foodiexpress.git
   cd Foodiexpress
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file inside the `server/` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

5. **Run the Application**
   * Start the backend server:
     ```bash
     cd server
     npm run dev
     ```
   * Start the client development server:
     ```bash
     cd client
     npm start
     ```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/restaurants` | Fetch all restaurants | Public |
| `GET` | `/api/restaurants/:id` | Fetch menu for a specific restaurant | Public |
| `POST` | `/api/orders` | Place a new food order | Private |
| `GET` | `/api/orders/user` | Fetch order history for logged-in user | Private |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/prathameshsutar140">Prathamesh Sutar</a></p>
</div>
