# The Velvet Spine - BookStore Project Documentation

## Project Overview
The Velvet Spine is a full-stack web application for an online bookstore that allows users to browse, purchase, and manage books. The application features a modern React frontend with a Node.js/Express backend, providing a complete e-commerce experience for book enthusiasts.

## Technical Architecture

### Frontend (React + Vite)
- **Framework**: React 18.3.1 with Vite for fast development
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Redux Toolkit for global state management
- **Routing**: React Router DOM for client-side navigation
- **HTTP Client**: Axios for API communication
- **Icons**: React Icons for UI components

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests
- **Environment**: dotenv for configuration management

## Key Features

### User Management
- **User Registration**: New user signup with validation
- **User Authentication**: Login/logout functionality with JWT tokens
- **Role-based Access**: Two user roles - "user" and "admin"
- **Profile Management**: User profile with avatar, address, and settings
- **Password Security**: Hashed passwords using bcryptjs

### Book Management
- **Book Catalog**: Browse all available books
- **Book Details**: Detailed view of individual books
- **Book Information**: Title, author, price, description, language
- **Book Images**: Visual representation with cover images

### Shopping Features
- **Shopping Cart**: Add/remove books from cart
- **Favorites**: Save books to personal favorites list
- **Order Management**: Place and track orders
- **Order History**: View past purchases and order status

### Admin Features
- **Book Management**: Add new books to the catalog
- **Order Management**: View and manage all orders
- **User Management**: Admin access to user accounts

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BookCard/        # Book display component
│   │   ├── Home/            # Homepage components
│   │   ├── Navbar/          # Navigation component
│   │   ├── Profile/         # User profile components
│   │   └── ViewBookDetails/ # Book detail view
│   ├── pages/               # Main application pages
│   ├── store/               # Redux state management
│   └── assets/              # Static assets
└── public/                  # Public static files
```

### Backend Structure
```
backend/
├── models/                  # Database models
│   ├── book.js             # Book schema
│   ├── user.js             # User schema
│   └── order.js            # Order schema
├── routes/                  # API route handlers
│   ├── book.js             # Book-related endpoints
│   ├── user.js             # User management endpoints
│   ├── cart.js             # Shopping cart endpoints
│   ├── favourite.js        # Favorites management
│   └── order.js            # Order management endpoints
└── conn/                   # Database connection
```

## Database Schema

### User Model
- username (unique)
- email (unique)
- password (hashed)
- address
- avatar
- role (user/admin)
- favourites (array of book references)
- cart (array of book references)
- orders (array of order references)

### Book Model
- url (image URL)
- title
- author
- price
- desc (description)
- language
- timestamps (created/updated)

### Order Model
- user (reference to user)
- book (reference to book)
- status
- timestamps

## API Endpoints
- **Base URL**: `http://localhost:1000/api/v1`
- **Authentication**: JWT token required for protected routes
- **Key Endpoints**:
  - `/get-all-books` - Retrieve all books
  - `/sign-up` - User registration
  - `/log-in` - User authentication
  - `/get-user-information` - Get user profile
  - `/add-to-favourite` - Add book to favorites
  - `/add-to-cart` - Add book to cart

## Development Setup

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
# Set up environment variables (PORT, MongoDB connection)
npm start
```

## Notable Features
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI with zinc and yellow color scheme
- **Image Assets**: Custom logo, hero image, and book cover images
- **Loading States**: Loader components for better UX
- **Error Handling**: Proper error messages and validation
- **Security**: Password hashing and JWT authentication

## Application Pages
- **Home**: Landing page with hero section and recently added books
- **All Books**: Complete book catalog with grid layout
- **Book Details**: Individual book information and purchase options
- **Cart**: Shopping cart management
- **Profile**: User profile with favorites, order history, and settings
- **Login/Signup**: User authentication pages
- **Admin Panel**: Administrative functions for book and order management

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Development**: ESLint, PostCSS, Autoprefixer

The Velvet Spine provides a complete online bookstore experience with modern web technologies and a clean, user-friendly interface.
