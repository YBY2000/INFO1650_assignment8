const User = require('../models/User');

module.exports = (app) => {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    // Create a new user
    app.post('/user/create', async (req, res) => {
        try {
            const { fullName, email, password } = req.body;
            // Implement password validation here

            const newUser = new User({ fullName, email, password });
            await newUser.save();
            res.json({ message: 'User created successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    });

    // Update user details (full name and password)
    app.put('/user/edit', async (req, res) => {
        try {
            const { fullName, password } = req.body;
            // Ensure you don't update email
            const email = req.body.email; 

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found! Please Check your Email' });
            }

            // Implement full name and password validation here

            user.fullName = fullName;
            user.password = password;
            await user.save();

            res.json({ message: 'User updated successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Invalid full name or password' });
        }
    });

    // Delete user by email
    app.delete('/user/delete', async (req, res) => {
        try {
            const email = req.body.email;
            const user = await User.findOneAndDelete({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user' });
        }
    });

    // Get all users' full names, email addresses, and passwords (for demonstration purposes only; not recommended in practice)
    app.get('/user/getAll', async (req, res) => {
        try {
            const users = await User.find({}, 'fullName email password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users' });
        }
    });
}