# Lost and Found Mobile App

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   - Open `.env` and fill in the required values:
     - `PORT`: The port number for the server (default: 5000)
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key

4. Start the server:
```bash
node server.js
```

## Frontend Setup

1. Navigate to the project root directory
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```

## Environment Variables

The following environment variables are required for the backend:

- `PORT`: The port number for the server (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication

Contact the project administrator to get the actual values for these variables. 