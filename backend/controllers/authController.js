import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '7d',
    });
};

export const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        }
    } catch (e) {
        res.status(500).json({ message: e.message || "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.status(200).json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message || "Server error" });
    }
};

export default registerUser;