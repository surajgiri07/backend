# YouTube Clone Backend API

A backend API for a YouTube-like application built using **Node.js, Express.js, MongoDB, and Mongoose**.
This project provides functionality for user authentication, video management, playlists, comments, subscriptions, and cloud-based media storage.

## 🚀 Features

### User Management

* User registration and login
* JWT-based authentication
* Secure password handling
* Update user profile
* Change password
* Get user channel profile

### Video Management

* Upload videos
* Update video details
* Delete videos
* Publish/unpublish videos
* Get all videos
* Search and filter videos

### Playlist Management

* Create playlists
* Update playlists
* Delete playlists
* Add videos to playlists
* Remove videos from playlists
* Get user playlists

### Comment System

* Add comments on videos
* Update comments
* Delete comments
* Get video comments

### Subscription System

* Subscribe/unsubscribe to channels
* Get subscriber information
* Get subscribed channels

### Media Storage

* Video and image uploads using Cloudinary
* File handling using Multer

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose ODM

### Authentication

* JWT (JSON Web Token)
* Cookies

### File Upload

* Multer
* Cloudinary

### Development Tools

* Nodemon
* Postman
* Git

---

# 📂 Project Structure

```
src
│
├── controllers
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── playlist.controller.js
│   └── comment.controller.js
│
├── models
│   ├── user.model.js
│   ├── video.model.js
│   ├── playlist.model.js
│   └── comment.model.js
│
├── routes
│
├── middleware
│
├── utils
│
├── db
│
└── app.js
```

---

# ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project directory:

```bash
cd project-name
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=8000

MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=your_frontend_url

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Running the Project

For development:

```bash
npm run dev
```

The server will start on:

```
http://localhost:8000
```

---

# 📌 API Endpoints (Example)

## Users

```
POST   /api/v1/users/register
POST   /api/v1/users/login
POST   /api/v1/users/logout
GET    /api/v1/users/channel/:username
PATCH  /api/v1/users/update-account
```

## Videos

```
GET    /api/v1/videos
POST   /api/v1/videos/publish
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
```

## Playlists

```
POST   /api/v1/playlists
GET    /api/v1/playlists/user/:userId
GET    /api/v1/playlists/:playlistId
PATCH  /api/v1/playlists/:playlistId
DELETE /api/v1/playlists/:playlistId
```

---

# 🧠 Learning Goals

This project helped me understand:

* REST API development
* Authentication and authorization
* MongoDB database design
* Mongoose models and relationships
* Aggregation pipelines
* File uploads
* Cloud storage integration
* Backend architecture

---

# 📌 Future Improvements

* Add pagination
* Add advanced searching
* Add video recommendations
* Add likes/dislikes
* Add notifications
* Deploy backend and database

---

# 👨‍💻 Author

Suraj Giri

Backend Developer in progress 🚀
