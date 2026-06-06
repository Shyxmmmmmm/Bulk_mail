const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

app.use(express.json())
app.use(cors())

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch((err) => {
        console.log(err)
    })

// Schema
const MailSchema = new mongoose.Schema({
    message: String,
    totalEmails: Number,
    sentAt: {
        type: Date,
        default: Date.now
    }
})

const Mail = mongoose.model("Mail", MailSchema)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})


app.post("/sendmail", async (req, res) => {
    try {
        const { msg, email } = req.body

        console.log("========== NEW REQUEST ==========")
        console.log("Message:", msg)
        console.log("Emails:", email)

        for (let i = 0; i < email.length; i++) {

            console.log("Before sendMail:", email[i])

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email[i],
                subject: "Testing Mail",
                text: msg
            })

            console.log("After sendMail:", email[i])
        }

        console.log("Before Mongo Save")

        await Mail.create({
            message: msg,
            totalEmails: email.length
        })

        console.log("After Mongo Save")

        res.send(true)

    } catch (err) {

        console.log("========== ERROR ==========")
        console.log(err)

        res.send(false)
    }
})

app.get("/testmail", async (req, res) => {
    try {
        await transporter.verify()
        res.send("SMTP OK")
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})