# LinkedIn Clone (JobNexus)

A full-stack social media application inspired by LinkedIn, built with modern web technologies.

## 🚀 Features

- User authentication and authorization
- User profiles with profile picture upload
- Post creation and sharing
- Social connections and networking
- File uploads with Cloudinary integration
- PDF generation capabilities
- Responsive design
- Real-time interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework for production
- **React 19** - JavaScript library for building user interfaces
- **Redux Toolkit** - State management
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Cloud-based image and video management
- **Multer** - File upload middleware
- **Puppeteer** - PDF generation and web scraping
- **PDFKit** - PDF generation library
- **bcrypt** - Password hashing

## 📁 Project Structure

```
JobNexus/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   └── pages/       # Next.js pages
│   ├── package.json
│   └── next.config.mjs
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not yet implemented)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 API Endpoints

The backend provides RESTful API endpoints for:
- User management (registration, login, profile)
- Post creation and management
- File uploads
- Social connections
- Comments and interactions

API documentation can be found in `backend/api.http` file.

## 🎨 Features Overview

- **User Authentication**: Secure login and registration system
- **Profile Management**: Users can create and update their profiles
- **Post Sharing**: Create and share posts with text and images
- **Image Upload**: Profile pictures and post images via Cloudinary
- **Social Networking**: Connect with other users
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Build and deploy the Express.js application
3. Ensure MongoDB connection is configured

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the generated files to your hosting platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues or have suggestions for improvements, please create an issue on the GitHub repository.

## 📞 Contact

For questions or support, please reach out to the project maintainer.

---

**Note**: This is a learning project and is not affiliated with LinkedIn Corporation.
