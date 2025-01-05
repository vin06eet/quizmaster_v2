import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import bodyParser from "body-parser"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import quizRoute from "./routes/quiz.route.js"

dotenv.config()
const app = express()

app.use(bodyParser.json())

connectDB()

app.use('/api', authRoute)
app.use('/api', userRoute)
app.use('/api', quizRoute)

const PORT = process.env.PORT || 6000

app.listen(PORT, ()=>{
    console.log(`Listening at port ${PORT}`);
})
