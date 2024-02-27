require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')
const cors = require('cors')
const app = express()
app.use(cors())
const corsOptions = {
  origin: "*",
  methods: ["POST","GET"],
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = 3010;
app.listen(PORT,()=>{
    console.log("Server is running")
})
app.use(express.json())
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("Connected to DB")})
.catch((error)=>console.log(error))
app.use(express.json());
app.use("/api/v1",authRoutes)
app.use("/api/v1",dashboardRoutes)