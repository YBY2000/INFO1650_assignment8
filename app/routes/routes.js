const User = require('../models/User');
const bcrypt = require('bcrypt'); 

module.exports = (app) => {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes


    // Create a new user
    app.post('/user/create', async (req, res) => {
        try {
            const { fullName, email, password } = req.body;
            // Empty Validation
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: 'Please provide all required fields.' });
            }
            
            // Email validation
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email address.' });
            }

            // Full Name validation
            if (fullName.trim() === '') {
                return res.status(400).json({ message: 'Full Name cannot be empty.' });
            }
            if (!validateFullname(fullName)) {
                return res.status(400).json({ message: 'Full name can only have empty space and English letters.' });
            }

            // Password strength validation
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message:
                        'Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, and one number.',
                });
            }
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // // Create a new user
            // const newUser = new User({
            //     fullName,
            //     email,
            //     password: hashedPassword,
            // });

            const newUser = new User({ fullName, email, password });
            await newUser.save();
            res.json({ message: 'User created successfully' });
        } catch (error) {
            res.status(400).json({ message: 'Error saving user to the database.' });
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

            // Empty Validation
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: 'Please provide all required fields.' });
            }
            
            // Full Name validation
            if (fullName.trim() === '') {
                return res.status(400).json({ message: 'Full Name cannot be empty.' });
            }
            if (!validateFullname(fullName)) {
                return res.status(400).json({ message: 'Full name can only have empty space and English letters.' });
            }

            // Password strength validation
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message:
                        'Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, and one number.',
                });
            }

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


// Password validation function
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return passwordRegex.test(password);
};

const validateFullname = (fullName) => {
    const fullNameRegex = /^[a-zA-Z\s\d*]+$/;
    return fullNameRegex.test(fullName);

};

const validateEmail = (email) => {
    const emailRegex = /^(\w+\.)*\w+(@northeastern.edu)$/;
    return emailRegex.test(email);

};