import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password
        } = req.body
        if(!username)
            return res.status(400).json({message: "user is required"})
        const existingUser  = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ error: "Username already exists" });
        const user = new User({username, email, password})
        await user.save()
        res.status(201).json({
            message: "User created successfully",
            id: user._id
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const user = await User.findOne({email})
        if(!user)
            return res.status(404).json({message: "User not found"})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(400).json({message: "Incorrect password"})
        const token = jwt.sign({id: user._id}, process.env.JWT_KEY, {expiresIn: '1h'})
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export {register, login}