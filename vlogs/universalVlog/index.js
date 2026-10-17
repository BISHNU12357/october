import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5500"
}))
app.use(cookieParser())

let users = [];
let notes = [];
const jwt_secret = "bishnu123"


const auth = (req, res, next) => {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const response = jwt.verify(token, jwt_secret)
    req.user = response;
    if(response){
        // res.json({
        //     message: "logged in"
        // })
        next();
    }else{
        res.json({
            success: false,
            message: "user is not available"
    })}
}
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isAvailable = users.find(user => user.username == username);
    if(isAvailable){
        res.json({
            success: false,
            message: "The user is available already"
        })
    }else{
        users.push({username: username, password: password})

        res.json({
            success: true,
            message: "user signed up successfully."
        })
    }
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isAvailable = users.find(user => user.username == username);
    if(isAvailable && isAvailable.password == password){
        const token = jwt.sign({username: username, password: password}, jwt_secret)
        // res.cookie("token", token)
        res.json({
            token: token,
            success: true,
            message: "The user is loggedin"
        })
    }else{
        res.json({
            success: false,
            message: "user credentials not valid"
        })
    }
})

app.get("/", auth, (req, res) => {
    res.json({
        success: true,
        notes: notes,
    })
})

app.post("/write", auth, (req, res) => {
    const note = {username: req.user.username, note: req.body.note}
    notes.push(note);
    res.json({
        success: true,
        message: "The note is submitted successfully."
    })
})

app.listen(3000, () => {
    console.log("server is connected on port 3000");
})