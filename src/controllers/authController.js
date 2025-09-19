const User = require('../models/User');

// Display login page
exports.showLogin = (req, res) => {
    try {
        res.render('pages/login', {
            title: 'Admin Login - Royal Wedding by Ully Sjah',
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).render('pages/error', {
            errorCode: 500,
            errorMessage: 'Internal server error'
        });
    }
};

// Handle login form submission
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Validate input
        if (!identifier || !password) {
            return res.render('pages/login', {
                title: 'Admin Login - Royal Wedding by Ully Sjah',
                error: 'Please provide both username/email and password',
                success: null
            });
        }

        // Find user by email or username
        const user = await User.findByCredentials(identifier);
        if (!user) {
            return res.render('pages/login', {
                title: 'Admin Login - Royal Wedding by Ully Sjah',
                error: 'Invalid credentials',
                success: null
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('pages/login', {
                title: 'Admin Login - Royal Wedding by Ully Sjah',
                error: 'Invalid credentials',
                success: null
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create session
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.userEmail = user.email;
        req.session.userRole = user.role;
        req.session.isAuthenticated = true;

        // Redirect to intended page or admin dashboard
        const redirectTo = req.session.returnTo || '/admin';
        delete req.session.returnTo;
        
        res.redirect(redirectTo);
    } catch (error) {
        console.error('Login error:', error);
        res.render('pages/login', {
            title: 'Admin Login - Royal Wedding by Ully Sjah',
            error: 'An error occurred during login. Please try again.',
            success: null
        });
    }
};

// Handle logout
exports.logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.redirect('/admin');
            }
            
            res.clearCookie('connect.sid'); // Clear session cookie
            res.redirect('/admin/login?success=logged_out');
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.redirect('/admin');
    }
};

// Display registration page (for super admin only)
exports.showRegister = (req, res) => {
    try {
        res.render('pages/register', {
            title: 'Create Admin User - Royal Wedding by Ully Sjah',
            error: null,
            success: null
        });
    } catch (error) {
        console.error('Error rendering register page:', error);
        res.status(500).render('pages/error', {
            errorCode: 500,
            errorMessage: 'Internal server error'
        });
    }
};

// Handle registration form submission
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;

        // Validate input
        if (!username || !email || !password || !confirmPassword) {
            return res.render('pages/register', {
                title: 'Create Admin User - Royal Wedding by Ully Sjah',
                error: 'All fields are required',
                success: null
            });
        }

        if (password !== confirmPassword) {
            return res.render('pages/register', {
                title: 'Create Admin User - Royal Wedding by Ully Sjah',
                error: 'Passwords do not match',
                success: null
            });
        }

        if (password.length < 6) {
            return res.render('pages/register', {
                title: 'Create Admin User - Royal Wedding by Ully Sjah',
                error: 'Password must be at least 6 characters long',
                success: null
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.render('pages/register', {
                title: 'Create Admin User - Royal Wedding by Ully Sjah',
                error: 'User with this email or username already exists',
                success: null
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password,
            role: role || 'admin'
        });

        await newUser.save();

        res.render('pages/register', {
            title: 'Create Admin User - Royal Wedding by Ully Sjah',
            error: null,
            success: 'Admin user created successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.render('pages/register', {
            title: 'Create Admin User - Royal Wedding by Ully Sjah',
            error: 'An error occurred during registration. Please try again.',
            success: null
        });
    }
};