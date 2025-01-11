import {GoogleGenerativeAI} from '@google/generative-ai'
import { uploadAndOcr } from '../middlewares/uploadAndOcr.middleware.js'

const geminiApi = async (req, res)=>{
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
        const prompt = `You are a JSON generator for academic question banks. Based on the text I provide, generate a JSON object that follows this structure:

{
  "title": "<Insert the title of the question bank>",
  "description": "<Insert a brief description>",
  "questions": [
    {
      "question_number": "<Unique identifier for the question>",
      "question_text": "<The text of the question>",
      "options": [
        "<Option 1>",
        "<Option 2>",
        "<Option 3>",
        "<Option 4>"
      ],
      "correct_answer": "<The correct answer or an empty string if unknown>"
    }
  ]
}
### Now Your Turn:
Please generate a JSON object for the following input text:
 '${req.recognizedText}'`
        const result = await model.generateContent(prompt) 
        console.log(result.response.text())
        res.status(200).json({response: result.response.text()})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export { geminiApi }