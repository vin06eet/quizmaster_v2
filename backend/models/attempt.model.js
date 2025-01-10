import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    title: {
        type: mongoose.Schema.Types.String,
        ref: 'Quiz'
    },
    description: {
        type: mongoose.Schema.Types.String,
        ref: 'Quiz'
    },
    questions: [{
        question: {
            type: mongoose.Schema.Types.String,
            ref: 'Quiz'
        },
        options: [{
            type: mongoose.Schema.Types.String,
            ref: 'Quiz'
        }],
        // Check this part
        answer: {
            type: mongoose.Schema.Types.String,
            ref: 'Quiz'
        },
        markedOption: {
            type: String
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        score: {
            type: Number,
            default: 0
        }
    }],
    timeTaken: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: Number,
        default: 0
    }
},{timestamps: true});

export default mongoose.model('Attempt', attemptSchema)