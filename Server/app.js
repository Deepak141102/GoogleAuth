import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-default-session-secret',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Ensure Google credentials are provided
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Missing Google client ID or secret in environment variables');
    process.exit(1);
}

// Configure Passport with Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Store user profile in session
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes for Google authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        res.redirect('/home');
    }
);

// Route to log out
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        // Broadcast logout event to other tabs
        res.redirect('/');
    });
});

// Route to get user profile
app.get('/user', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
});

// Middleware to protect the home route
app.get('/home', (req, res, next) => {
    if (!req.isAuthenticated()) {
        // User is not authenticated, redirect to login page
        return res.redirect('/');
    }
    // User is authenticated, serve the home page
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Serve static files for the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
