import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '').trim()
    if(!token)
        return res.status(400).json({message: "Access Denied"})
    try {
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.user = decode
        next()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export default authenticate