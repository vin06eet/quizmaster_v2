import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '').trim()
    if(!token)
        return res.status(400).json({message: "Access Denied"})
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export default authenticate