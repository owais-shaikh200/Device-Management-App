# Device Management App

It is a robust and scalable RESTful API built with **Node.js**, **Express**, and **MongoDB**. It provides secure management of users, devices, and controllers with JWT-based authentication, cloud-based image uploads, and comprehensive API documentation via Swagger UI.

---

## 🚀 Features

- 🔐 **User Authentication** using **JWT** (Login & Protected Routes)
- 👥 **User Management**: Full CRUD operations
- 🛠️ **Device Management**: 
  - CRUD operations
  - Multi-image upload to **Cloudinary**
  - Association with users and multiple controllers
  - Automatic cleanup of references and images on delete
- 🎮 **Controller Management**: CRUD and many-to-many relationship with devices
- ☁️ **Image Uploads**: Integrated with **Cloudinary** via `multer`
- 📂 **Modular Folder Structure**
- 📋 **Request Validation** using `express-validator`
- ⚠️ **Global Error Handling**
- 🧪 **Postman-Testable API**
- 📄 **Swagger UI Documentation** at `/api-docs`

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Cloudinary** (Image Hosting)
- **Multer** (Image Upload Middleware)
- **JWT** (`jsonwebtoken`)
- **bcryptjs** (Password Hashing)
- **dotenv** (Environment Config)
- **Nodemon** (Dev Server)
- **Swagger UI** (`swagger-jsdoc`, `swagger-ui-express`)

## 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/controlsync-api.git
   cd controlsync-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` File**
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the Server**
   ```bash
   node index.js
   ```

---

## 🔐 Authentication Routes

- **Register:** `POST /api/auth/register`
- **Login:** `POST /api/auth/login`

Use the returned JWT token in the `Authorization` header for protected routes:

```
Authorization: Bearer <token>
```

---

## 📘 Swagger API Docs

Access full API documentation at:

```
http://localhost:3000/api-docs
```

---

## ⚙️ Functionality Highlights

- **Bi-directional reference management** between Devices and Controllers.
- **Automatic reference cleanup** on deletion (e.g., when a device is deleted, its reference is removed from controllers, and its images are removed from Cloudinary).
- **Password hashing** with bcrypt for secure login.
- **Token-based protected routes** using a reusable middleware.

---

## ✅ Testing

All routes can be tested via **Postman**. Ensure a valid JWT token is included in headers for protected routes.

---

## 📌 Notes

- Replace placeholders in `.env` with real values before starting the app.
- MongoDB Atlas or local instance can be used for database.
- Cloudinary is required for image handling.

---

> ✨ Built for performance, scalability, and real-world use cases.
