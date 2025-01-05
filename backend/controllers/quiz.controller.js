import Quiz from '../models/quiz.model.js';

const getAllQuizzes = async (req, res)=>{
    try {
        const quizzes = await Quiz.find();
        if(!quizzes)
            return res.status(404).json({message: "No quizzes found"});
        res.status(200).json({quizzes})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
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

        if(!title||!questions||!marks)
            return res.status(400).json({message: "Title , questions and marks are required"})

        if(!Array.isArray(questions)||questions.length === 0)
            return res.status(400).json({message: "Questions should be as a non-empty array"})
        
        for(const ques of questions){
            if(!ques.question||!ques.options||!ques.answer)
                return res.status(400).json({message: "Question, options and answer are required"})
            if(!Array.isArray(ques.options)||ques.options.length <=2 )
                return res.status(400).json({message: "Options should be as an array with atleast two options"})
            if(!ques.options.includes(ques.answer))
                return res.status(400).json({message: "Answer should be in options"})
        }

        if(!Array.isArray(marks)||marks.length!==questions.length)
            return res.status(400).json({message: "Marks should be as an array with same length as questions"})
        
        const allowedDifficulties = ["Easy", "Medium", "Hard"]
        if(difficultyLevel && !allowedDifficulties.includes(difficultyLevel))
            return res.status(400).json({message: "Difficulty level should be one of the following: Easy, Medium, Hard"})
        const createdBy = req.params.id
        const newQuiz = new Quiz({
            title,
            description,
            questions,
            time: time||240,
            marks,
            difficultyLevel: difficultyLevel||"Easy",
            createdBy,
            attemptedBy: []
        })
        
        const savedQuiz = await newQuiz.save();
        res.status(200).json({savedQuiz})
        console.log(createdBy)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export {getAllQuizzes, getQuizById, updateQuiz, deleteQuiz, uploadQuiz}