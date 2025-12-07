const adminController = {
    login: async (req, res) => {
        const { username, password } = req.body;
        
        if (username === 'admin' && password === 'admin123') {
            res.json({ 
                success: true, 
                message: 'Login successful',
                token: 'demo-token-123'
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
};

module.exports = adminController;