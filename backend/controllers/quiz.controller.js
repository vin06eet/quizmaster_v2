import Quiz from '../models/quiz.model.js';
import User from '../models/user.model.js';
import Attempt from '../models/attempt.model.js';
import mongoose from 'mongoose';

//works fine
const getAllQuizzes = async (req, res) => {
    try {
        const userID = req.user._id; 
        const user = await User.findById(userID).populate('quizzesCreated');
        if (!user)
            return res.status(404).json({ message: "User  not found" });
        const quizzes = user.quizzesCreated;
        if (!quizzes || quizzes.length === 0)
            return res.status(404).json({ message: "No quizzes found for this user" });
        res.status(200).json({ quizzes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//works fine
const getQuizById = async (req, res)=>{
    try {
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz)
            return res.status(404).json({message: "No quiz of this id found"})
        res.status(200).json({quiz})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//works fins
const updateQuiz = async (req, res)=>{
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!quiz)
            return res.status(404).json({message: "No quiz of this id found"})
        res.status(200).json({quiz})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//works fine
const deleteQuiz = async (req, res)=>{
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if(!quiz)
            return res.status(404).json({message: "No quiz of this id found"})
        res.status(200).json({quiz})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//works fine
const uploadQuiz = async (req, res)=>{
    try {
        const {
            title,
            description,
            questions,
            time,
            marks,
            difficultyLevel,
            attemptedBy
        } = req.body;

        if(!title||!questions)
            return res.status(400).json({message: "Title , questions and marks are required"})

        if(!Array.isArray(questions)||questions.length === 0)
            return res.status(400).json({message: "Questions should be as a non-empty array"})
        
        for(const ques of questions){
            if(!ques.question||!ques.options||!ques.answer||!ques.marks)
                return res.status(400).json({message: "Question, options and answer are required"})
            if(!Array.isArray(ques.options)||ques.options.length <=2 )
                return res.status(400).json({message: "Options should be as an array with atleast two options"})
            if(!ques.options.includes(ques.answer))
                return res.status(400).json({message: "Answer should be in options"})
        }
        
        const allowedDifficulties = ["Easy", "Medium", "Hard"]
        if(difficultyLevel && !allowedDifficulties.includes(difficultyLevel))
            return res.status(400).json({message: "Difficulty level should be one of the following: Easy, Medium, Hard"})
        const newQuiz = new Quiz({
            title,
            description,
            questions,
            time: time||240,
            difficultyLevel: difficultyLevel||"Easy",
            attemptedBy: []
        })
        const savedQuiz = await newQuiz.save();
        const user = await User.findById(req.user._id)
        if (!user)
            return res.status(404).json({ error: 'User  not found' })
        user.quizzesCreated.push(savedQuiz._id.toString())
        await user.save()
        res.status(200).json({savedQuiz})
        console.log(savedQuiz._id.toString())
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//works fine
const attemptQuiz = async (req, res)=>{
    try {
        const userID = req.user._id
        const quizID = req.params.id
        if (!mongoose.Types.ObjectId.isValid(quizID))
            return res.status(400).json({ error: 'Invalid quiz ID' });
        const quiz = await Quiz.findById(quizID);
        if (!quiz)
            return res.status(404).json({ message: "Quiz not found" });
        const quizDetails = {
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions.map(question => ({
                question: question.question,
                options: question.options,
                marks: question.marks
            })),
            time: quiz.time,
            difficultyLevel: quiz.difficultyLevel
        };
        res.status(200).json(quizDetails);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//works fine
const submitQuiz = async (req, res) => {
    try {
        const quizID = req.params.id;
        const userID = req.user._id;
        const answers = req.body.answers; 

        if (!mongoose.Types.ObjectId.isValid(quizID) || !mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ error: 'Invalid quiz ID or user ID' });
        }

        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
            return res.status(400).json({ error: 'Invalid number of answers provided' });
        }

        const attemptDetails = {
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions.map((question, index) => ({
                question: question.question,
                options: question.options,
                answer: question.answer, 
                markedOption: answers[index], 
                isCorrect: question.answer === answers[index], 
                score: question.answer === answers[index] ? question.marks : 0 
            })),
            timeTaken: req.body.timeTaken || 0, 
            totalMarks: 0 
        };

        
        attemptDetails.totalMarks = attemptDetails.questions.reduce((sum, question) => sum + question.score, 0);

        
        const newAttempt = new Attempt(attemptDetails);
        const savedAttempt = await newAttempt.save();

        
        quiz.attempts.push(savedAttempt._id);
        quiz.attemptedBy.push(userID);
        await quiz.save();
        
        const user = await User.findById(userID);
        user.quizzesAttempted.push(savedAttempt._id);
        await user.save();
        console.log(savedAttempt._id)
        res.status(200).json({
            message: 'Quiz attempt submitted successfully',
            attempt: savedAttempt,
            totalMarks: savedAttempt.totalMarks
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    uploadQuiz,
    attemptQuiz,
    submitQuiz
}

