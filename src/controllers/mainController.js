const nodemailer = require('nodemailer');

// Function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to validate phone number (basic validation)
const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

exports.handleContactForm = async (req, res) => {
    try {
        const { name, email, phone, weddingDate, package, message } = req.body;
        
        // Input validation
        const errors = [];
        
        if (!name || name.trim().length < 2) {
            errors.push('Nama harus diisi minimal 2 karakter');
        }
        
        if (!email || !isValidEmail(email)) {
            errors.push('Email tidak valid');
        }
        
        if (!phone || !isValidPhone(phone)) {
            errors.push('Nomor telepon tidak valid');
        }
        
        if (!message || message.trim().length < 10) {
            errors.push('Pesan harus diisi minimal 10 karakter');
        }
        
        if (errors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Data tidak valid', 
                errors: errors 
            });
        }
        
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransporter({
            service: 'gmail', // You can change this to other services
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        // Email content
        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || 'info@royalweddingully.com',
            subject: 'Pesan Baru dari Website Royal Wedding by Ully Sjah',
            html: `
                <h2>Pesan Baru dari Website</h2>
                <p><strong>Nama:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Nomor Telepon:</strong> ${phone}</p>
                <p><strong>Tanggal Pernikahan:</strong> ${weddingDate || 'Tidak disebutkan'}</p>
                <p><strong>Paket:</strong> ${package || 'Tidak disebutkan'}</p>
                <p><strong>Pesan:</strong></p>
                <p>${message}</p>
                <hr>
                <p><small>Dikirim melalui website Royal Wedding by Ully Sjah</small></p>
            `,
            text: `
                Pesan Baru dari Website
                
                Nama: ${name}
                Email: ${email}
                Nomor Telepon: ${phone}
                Tanggal Pernikahan: ${weddingDate || 'Tidak disebutkan'}
                Paket: ${package || 'Tidak disebutkan'}
                
                Pesan:
                ${message}
                
                Dikirim melalui website Royal Wedding by Ully Sjah
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Send success response
        res.json({ 
            success: true, 
            message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' 
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Send error response
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi kami langsung.' 
        });
    }
};