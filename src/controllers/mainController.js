exports.handleContactForm = (req, res) => {
    // Logika untuk menangani form submission
    const { name, email, phone, weddingDate, package, message } = req.body;
    
    // Di sini Anda bisa menambahkan logika untuk mengirim email,
    // menyimpan ke database, atau mengirim notifikasi
    
    res.json({ success: true, message: 'Pesan berhasil dikirim' });
};