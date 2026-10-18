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

// the variables
let users = [];
let notes = [];
const jwt_secret = "bishnu123"

// middleware for authrization to reduce the login and keeping the user expreience smooth
const auth = (req, res, next) => {
    const token = req.cookies.token;

    // 1. Check if the token exists first
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in."
        });
    }

    try {
        // 2. Safely verify the token
        const response = jwt.verify(token, jwt_secret);
        req.user = response;
        next();
    } catch (error) {
        // 3. Catch invalid/tampered tokens instead of crashing the server
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

// signing up a new user and adding to the user
app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(users)
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


// logging and sending the jwt token to the cookies of the user browser
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isAvailable = users.find(user => user.username == username);
    if(isAvailable && isAvailable.password == password){
        const token = jwt.sign({username: username, password: password}, jwt_secret)
        res.cookie("token", token, {
            httpOnly: true,     // JavaScript in the page can't read it
            sameSite: "lax",
            maxAge: 60 * 60 * 1000   // 1 hour
        })
        res.json({
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


//you see all the notes related to the user on the left side of the screen as soon as you login
app.get("/", auth, (req, res) => {
    // if(req.user.username == )
    const temp = []
    notes.map(note => {
        if(note.username === req.user.username)
            temp.push(note.note)
    })
    res.json({
        success: true,
        notes: temp,
    })
})

// this is used as a textarea to write any note
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