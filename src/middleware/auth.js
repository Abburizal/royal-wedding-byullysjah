// Authentication middleware to protect admin routes

// Check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAuthenticated) {
        return next();
    } else {
        // Store the original URL to redirect back after login
        req.session.returnTo = req.originalUrl;
        return res.redirect('/admin/login');
    }
};

// Check if user is already authenticated (for login page)
const requireGuest = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    return next();
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAuthenticated && req.session.userRole === 'admin') {
        return next();
    } else {
        return res.status(403).render('pages/error', {
            errorCode: 403,
            errorMessage: 'Access denied. Admin privileges required.'
        });
    }
};

// Check if user is super admin
const requireSuperAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAuthenticated && req.session.userRole === 'super_admin') {
        return next();
    } else {
        return res.status(403).render('pages/error', {
            errorCode: 403,
            errorMessage: 'Access denied. Super admin privileges required.'
        });
    }
};

// Middleware to attach user data to res.locals for templates
const attachUser = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isAuthenticated) {
        res.locals.currentUser = {
            id: req.session.userId,
            username: req.session.username,
            email: req.session.userEmail,
            role: req.session.userRole,
            isAuthenticated: true
        };
    } else {
        res.locals.currentUser = {
            isAuthenticated: false
        };
    }
    next();
};

module.exports = {
    requireAuth,
    requireGuest,
    requireAdmin,
    requireSuperAdmin,
    attachUser
};