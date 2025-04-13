# URL Shortener

A professional URL shortening service built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring user authentication, analytics, and link management.

![URL Shortener Dashboard](assests/Screenshot%202025-04-13%20114156.png)

## Features

- **User Authentication**
  - Secure email and password authentication
  - JWT-based session management
  - Protected routes and API endpoints

- **Link Management**
  - Create shortened URLs with optional custom aliases
  - Set expiration dates for links
  - Track click statistics
  - Search and filter links
  - Pagination for better performance

- **Analytics**
  - Real-time click tracking
  - Visual analytics with interactive charts
  - Historical data visualization

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Real-time updates
  - Loading states and error handling

## Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- React Hook Form for form handling
- Chart.js for analytics visualization
- Tailwind CSS for styling
- TypeScript for type safety

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture
- Secure password hashing with bcrypt

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
# Start the backend server
npm run server

# In a new terminal, start the frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Links
- `GET /links` - Get user's links (with pagination and search)
- `POST /links` - Create new short link
- `GET /links/:shortUrl` - Redirect to original URL and track click

## Project Structure

### Backend (server folder)
### Frontend (src folder)

```
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Link.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── links.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   │   └── slices/
│   ├── types/
│   └── App.tsx
└── package.json
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- Secure HTTP headers
- Rate limiting for API endpoints

## Best Practices

- TypeScript for enhanced type safety
- Redux for predictable state management
- Responsive design principles
- Error handling and validation
- Code splitting and lazy loading
- Performance optimizations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)

## Testing Credentials

email: intern@dacoid.com
password: Test123



