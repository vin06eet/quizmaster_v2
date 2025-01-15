import express from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import { getAllQuizzes, getQuizById, updateQuiz, deleteQuiz, uploadQuiz, attemptQuiz, submitQuiz, getAttempt, getAllAttempts } from '../controllers/quiz.controller.js'

const router = express.Router()

router.get('/quiz', authenticate, getAllQuizzes)
router.get('/quiz/:id', authenticate, getQuizById)
router.put('/quiz/:id', authenticate, updateQuiz)
router.delete('/quiz/:id', authenticate, deleteQuiz)
router.post('/quiz', authenticate, uploadQuiz)
router.get('/quiz/attempt/:id', authenticate, attemptQuiz)
router.post('/quiz/attempt/:id', authenticate, submitQuiz)
router.get('/quiz/attempt/:id', authenticate, getAttempt)
router.get('/quiz/attempt', authenticate, getAllAttempts)

export default router