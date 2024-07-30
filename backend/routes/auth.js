import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js';

const JWT_SECRET = '1@3$5^';

const router = express.Router();

// Route 1 : Create a user : POST (/api/auth/createUser) - Doesn't require auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 3 }),
], async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            // Check wether this email exists already
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(req.body.password, salt);
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(400).json({ success, error: "Email already exists!" })
            }
            user = await User.create({ email: req.body.email, name: req.body.name, password: securePassword });
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            return res.json({ success, authToken });
        } catch (error) {
            success = false;
            console.error(error.message);
            return res.status(500).send(success,  "Internal Server Error");
        }
    } else {
        success = false;
        return res.status(400).json({ success, erros: errors.array() });
    }
})


// Route 2 :  Create a user : POST (/api/auth/login) - No Login Required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists(),
], async (req, res) => {
    let success = false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Please enter valid credentials!" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: "Please enter valid credentials!" });
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 3 :  Get logged in user details : POST (/api/auth/getuser) - Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});


export default router;