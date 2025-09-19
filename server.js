require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./src/config/database');
const { attachUser } = require('./src/middleware/auth');
const app = express();
const port = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/view'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'royal-wedding-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/royal-wedding',
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Attach user data to res.locals for templates
app.use(attachUser);

// Routes
app.use('/', require('./src/route/main'));

// Initialize database connection and start server
const startServer = async () => {
    // Start server immediately
    const server = app.listen(port, () => {
        console.log(`🚀 Royal Wedding by Ully Sjah running on http://localhost:${port}`);
        console.log(`📋 Authentication system configured and ready`);
        console.log(`🔑 Login page: http://localhost:${port}/admin/login`);
    });
    
    // Try database connection in background (non-blocking)
    setTimeout(async () => {
        try {
            await connectDB();
        } catch (error) {
            console.log('⚠️ Database connection failed, continuing without database');
        }
    }, 100);
    
    return server;
};

startServer();