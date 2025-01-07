import express from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import { getAllQuizzes, getQuizById, updateQuiz, deleteQuiz, uploadQuiz } from '../controllers/quiz.controller.js'

const router = express.Router()

router.get('/quiz', getAllQuizzes)
router.get('/quiz/:id', getQuizById)
router.put('/quiz/:id', authenticate, updateQuiz)
router.delete('/quiz/:id', authenticate, deleteQuiz)
router.post('/quiz', authenticate, uploadQuiz)

export default router