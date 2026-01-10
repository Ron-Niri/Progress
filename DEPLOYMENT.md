# Progress App - Production Deployment Guide

## Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

## Environment Setup

### Server Configuration
1. Navigate to `server/` directory
2. Copy `.env.example` to `.env`
3. Update the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=generate_a_secure_random_string_here
   ```

### Client Configuration
1. Navigate to `client/` directory
2. Update `src/utils/api.js` baseURL to your production API URL

## Installation

```bash
# Install all dependencies
npm run install:all

# Or install separately
cd client && npm install
cd ../server && npm install
```

## Running in Development

```bash
# From root directory
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Building for Production

### Client Build
```bash
cd client
npm run build
```

The production build will be in `client/dist/`

### Server Deployment
The server is ready for deployment as-is. Recommended platforms:
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

## Database Setup

### MongoDB Atlas (Recommended)
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Copy the connection string to `MONGODB_URI` in `.env`

### Local MongoDB
```bash
# Install MongoDB locally
# Update MONGODB_URI to: mongodb://localhost:27017/progress-app
```

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable CORS only for your frontend domain in production
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags if using sessions
- [ ] Implement rate limiting (recommended: express-rate-limit)

## Deployment Steps

### Option 1: Deploy to Render (Recommended)

#### Backend
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables from `.env`

#### Frontend
1. Create new Static Site on Render
2. Set build command: `cd client && npm install && npm run build`
3. Set publish directory: `client/dist`

### Option 2: Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

## Post-Deployment

1. Test all features:
   - User registration/login
   - Habit creation and tracking
   - Goal management
   - Journal entries
   - Analytics dashboard

2. Monitor logs for errors

3. Set up database backups (MongoDB Atlas has automatic backups)

## Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Ensure network access is configured

### CORS Errors
- Update CORS configuration in `server/index.js`
- Add your frontend URL to allowed origins

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## Maintenance

- Regularly update dependencies: `npm update`
- Monitor MongoDB storage usage
- Review and rotate JWT secrets periodically
- Back up database regularly

## Support

For issues, check:
- Server logs
- Browser console
- MongoDB Atlas logs
- Network tab in DevTools
