import mongoose, { model } from 'mongoose';
import hashPassword from '../middlewares/hashPassword.middleware.js'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }]
}, {timestamps: true});

userSchema.pre('save', hashPassword)

export default mongoose.model('User', userSchema)