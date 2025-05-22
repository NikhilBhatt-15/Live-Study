# Teachstream

Teachstream is a full-stack web application for live streaming,live chat, video uploads, and interactive learning, designed for educators and learners. The project is organized into two main folders: **client** (frontend) and **server** (backend).

---
## Screenshots

> _Below are some screenshots of the Teachstream app interface:_

### Home Page

![HomePage](https://github.com/user-attachments/assets/7f1630c6-e0cc-48a6-98e1-a3b458ab0de4)

### Creator Dashboard

![Dashboard](https://github.com/user-attachments/assets/9c7986af-6069-4691-82a6-0162fd672da4)


### Live Stream with Chat

![LiveStreamPage](https://github.com/user-attachments/assets/463706f9-0cf6-4528-89d9-7894954df097)


### Recommendation Page

![RecommendationPage](https://github.com/user-attachments/assets/1e805973-b7cf-4a5e-a4ed-9c2f157dc81d)


### Profile Page

![Profile image](https://github.com/user-attachments/assets/56788004-e565-4c6f-a34d-7e36d2d5599c)

### Creator Dashboard

![Creator Dashboard](https://github.com/user-attachments/assets/c4137897-2fa2-4d63-8666-43eb2e503d1f)

### Video Page
![image](https://github.com/user-attachments/assets/ba0de432-1001-4532-9b62-4e035927a528)


## Project Structure

```
teachstream/
│
├── client/      # React frontend (user interface)
│   ├── public/
│   ├── src/
│   │   ├── api/                # API utility functions (e.g., auth.js)
│   │   ├── assets/             # Images, icons, static assets
│   │   ├── components/         # Reusable UI components (Navbar, VideoCard, LiveChat, etc.)
│   │   ├── context/            # React Contexts (AuthContext, SearchContext, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components (Dashboard, Profile, NotFound, etc.)
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── ...                 # Other utilities and helpers
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── server/      # Node.js/Express backend (API & WebSocket)
│   ├── controllers/            # Route controllers (video, user, auth, etc.)
│   ├── middleware/             # Express middleware (auth, error handling, etc.)
│   ├── models/                 # Mongoose models (User, Video, Livestream, etc.)
│   ├── routes/                 # Express route definitions
│   ├── utils/                  # Utility modules (cloudinary.js, etc.)
│   ├── wsServer.js             # WebSocket server for live chat
│   ├── app.js                  # Express app setup
│   ├── config/                 # Configuration files (db.js, etc.)
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

---

## Features

### Client (Frontend)

- **Modern React UI**: Built with React and Vite for fast development and performance.
- **Authentication**: Login, signup, and JWT-based session management.
- **Live Streaming**: Go live, end stream, and view live video with integrated chat.
- **Video Upload**: Upload videos with title, description, and file selection.
- **Dashboard**: Creator dashboard with stats, video management, and analytics.
- **Profile Management**: Edit profile, avatar, and view user stats.
- **Search**: Instant search for videos, courses, and teachers.
- **Responsive Design**: Works on desktop and mobile devices.
- **Error Handling**: User-friendly 404 and error pages.

### Server (Backend)

- **Express API**: RESTful endpoints for users, videos, livestreams, comments, etc.
- **WebSocket Server**: Real-time chat for live streams using `ws`.
- **MongoDB/Mongoose**: Data persistence for users, videos, livestreams, and chat.
- **Authentication**: JWT-based authentication and authorization middleware.
- **Cloudinary Integration**: Upload and delete videos/images using Cloudinary (see `utils/cloudinary.js`).
- **Robust Error Handling**: Centralized error handling and validation.
- **Environment Config**: Uses `.env` for secrets and configuration.

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- Cloudinary account (for media uploads)

---

### 1. Clone the repository

```bash
git clone https://github.com/NikhilBhatt-15/teachstream.git
cd teachstream
```

---

### 2. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

---

### 3. Environment Variables

#### Server

Create a `.env` file in the `server` directory with the following (example):

```
MONGODB_URI=mongodb://localhost:27017/teachstream
ACCESS_TOKEN_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=8000
```

#### Client

If you need to set API endpoints, create a `.env` file in `client`:

```
VITE_BASE_URL=http://localhost:8000/api
```

---

### 4. Running the App

#### Start the backend server

```bash
cd server
npm run dev
```

#### Start the frontend client

```bash
cd ../client
npm run dev
```

---

## Notable Code (Server)

- **`utils/cloudinary.js`**  
  Handles uploading and deleting files from Cloudinary.

  - `uploadOnCloudinary(filePath)`: Uploads any file (auto-detects type).
  - `deleteFromCloudinary(secureUrl)`: Deletes a file by its Cloudinary URL.
  - Make sure your Cloudinary credentials are set in `.env`.

- **`wsServer.js`**  
  Sets up the WebSocket server for real-time chat.
  - Validates JWT token and roomId before allowing chat.
  - Handles chat message broadcasting and chatroom management.

---

## Notable Code (Client)

- **`src/components/LiveChat.jsx`**  
  Connects to the WebSocket server for real-time chat.

  - Only connects if `roomId` is valid.
  - Sends JWT token if available.
  - Handles connection errors and displays user-friendly messages.

- **`src/pages/Dashboard/Dashboard.jsx`**  
  Main dashboard for creators, including video upload, live stream controls, and stats.

- **`src/components/Navbar/Navbar.jsx`**  
  Includes instant search and navigation.

---

## Troubleshooting

- **WebSocket/Chat not working?**

  - Ensure `roomId` and `token` are valid and not `"undefined"`.
  - Check your backend `.env` for `ACCESS_TOKEN_SECRET`.
  - Make sure MongoDB and Cloudinary credentials are correct.

- **Uploads not working?**
  - Check Cloudinary credentials.
  - Ensure the server can write to the `/uploads` directory if using local storage before upload.

---

## License

MIT

---

## Credits

Teachstream is built by [Nikhil Bhatt].  
Inspired by modern e-learning and streaming platforms.
