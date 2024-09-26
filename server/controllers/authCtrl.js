import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import Token from "../models/tokenModel.js";
import sendEmail from "../utils/sendEmail.js";

/* REGISTER */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, location } = req.body;
        if (!firstName || !email || !password || !role || !location) {
            return res.send("Please, Fill all the required Fields !");
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(200).send({ success: false, message: `User Already Exist` })
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            role,
            location,
        });

        const savedUser = await newUser.save();
        res.status(201).send({success: true, message:`Register Successfully`, savedUser });
    } catch (err) {
        res.status(500).send({ success: false, message: `Register Controller ${err.message}` });
    }
};

/* LOG IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({success: false, message: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({success: true, message: `Login Successfully`, token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error("User does not exist");
        }

        // Delete any existing token for the user
        let token = await Token.findOne({ userId: user._id });
        if (token) {
            await token.deleteOne();
        }

        // Create a new token valid for 5 minutes
        const newToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "5m",  // Changed to 5 minutes as per comment
        });

        await new Token({
            userId: user._id,
            token: newToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 15 * 60 * 1000, // 5 minutes expiration
        }).save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${newToken}`;
        console.log(`Frontend URL is: ${process.env.FRONTEND_URL}`);

        // Reset Email message content
        const message = `
            <h2>Hello ✋ ${user.firstName}</h2>
            <p>Please use the link below to reset your password</p>
            <p>This reset link is valid for 5 minutes.</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>Regards,</p>
            <p>Team Ye-Shaam-Mastaani</p>
        `;

        const subject = "Password Reset Request";
        const send_to = user.email;
        const sent_from = process.env.EMAIL_USER;

        // Send the reset email
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: "Reset Email Sent" });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.json({ success: false, message: "Email not sent, please try again" });
    }
};

export const resetPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const { resetToken } = req.params;

    try {
        // Validate passwords
        if (newPassword !== confirmPassword) {
            return res.status(400).send("Passwords do not match!");
        }

        // Verify the token (use the resetToken from params, not generating a new one)
        const hashedToken = jwt.verify(resetToken, process.env.JWT_SECRET);

        // Find the token in the database
        const userToken = await Token.findOne({
            token: resetToken,
            expiresAt: { $gt: Date.now() }
        });

        if (!userToken) {
            return res.status(404).send("Invalid or expired token");
        }

        // Find the user by userId from the token
        const user = await User.findById(userToken.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(newPassword, salt);
        user.password = hashedPass;

        // Save the updated user password
        await user.save();

        // Optionally, you can remove the token after password reset
        await userToken.deleteOne();

        res.status(200).send("Password reset successful, please log in");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
