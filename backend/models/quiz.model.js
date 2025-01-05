import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        answer: {
            type: String,
            required: true
        }
    }],
    time: {
        type: Number,
        default: Infinity
    },
    marks: [{
        type: Number,
        required: true
    }],
    difficultyLevel: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attemptedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {timestamps: true})

export default mongoose.model('Quiz', quizSchema)