import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailTrap/email.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            throw new Error('All fields are required');
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User({
            name,
            email,
            password: hashPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });
        await user.save();
        generateTokenAndSetCookie(res, user._id,);
        await sendVerificationEmail(user.email, verificationToken);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req, res) => { 
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = Date.now();
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                ...user._doc,
                password: undefined,
            },

        });
    } catch (error) {
        console.log("Error in Login".error)
        res.status(400).json({ message: error.message });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: true });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const forgotPassword = async (req, res) => { 
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hours
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully',
        })
    } catch (error) {
        console.log("Error in forgot password".error)
        res.status(400).json({ message: error.message });
    }
}

export const resetPassword = async (req, res) => { 
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({success:false, message: 'Invalid or expired reset token' });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.log("Error in reset password".error)
        res.status(400).json({ message: error.message });
    }
}

export const checkAuth = async (req, res) => { 
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(400).json({success:false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User is authenticated',
            user
        });

    } catch (error) {
        console.log("Error in check auth".error)
        res.status(400).json({ message: error.message });
    }
}