import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Generate Web Token

const generatetoken = (userID) => {
    return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: '7days' })
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //   check if user already exist or not
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User Already Exists" })
        }
        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Pasword must have atleast 8 Characters" })
        }
        //      hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //  Create a User

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generatetoken(user._id)
        })

    } catch (error) {
        res.status(400).json({
            message: "Server Error",
            error: error.message
        })
    }
}

//    Login Function

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({ message: "Invalid Email or Password" })
        }
        //  compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(500).json({ message: "Password not Matched" })
        }
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generatetoken(user._id)
        })
    } catch (error) {
        res.status(400).json({
            message: "Server Error",
            error: error.message
        })
    }
}

//  Get User Profile Function

export const GetUserProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }
        res.json(user)
    } catch (error) {
        res.status(400).json({
            message: "Server Error",
            error: error.message
        })
    }
    // res.send("hello Profile")
}












