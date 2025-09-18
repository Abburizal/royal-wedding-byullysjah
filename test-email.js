// Test script untuk menguji email functionality
// Jalankan dengan: node test-email.js

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmailConnection() {
    try {
        console.log('Testing email configuration...');
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ Not set');
        console.log('EMAIL_TO:', process.env.EMAIL_TO ? '✓ Set' : '✗ Not set');
        
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('\n❌ Please configure EMAIL_USER and EMAIL_PASS in .env file');
            return;
        }
        
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        // Verify connection
        await transporter.verify();
        console.log('\n✅ Email configuration is valid!');
        console.log('✅ SMTP connection successful!');
        
    } catch (error) {
        console.log('\n❌ Email configuration error:');
        console.log(error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n💡 Tips:');
            console.log('- Make sure you use an App Password for Gmail');
            console.log('- Enable 2-Step Verification in your Google Account');
            console.log('- Generate App Password in Google Account Settings > Security');
        }
    }
}

// Run test
testEmailConnection();