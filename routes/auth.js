const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
const jwtVerify = require('../Middleware/authMiddleware')
const cors = require('cors')

router.use(cors())

const corsOptions = {
  origin: "*",
  methods: ["POST","GET"],
  credentials: false,
};
router.use(cors(corsOptions));
router.options("/login", cors(corsOptions))

router.post("/register",async (req,res)=>{
    try {
        const {name, email, password, confirmPassword} = req.body;
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                message:"Bad Request",
                success:false
            })
        }

        const isExistingUser = await User.findOne({email: email})
        if(isExistingUser){
            return res.status(409).json({
                message:"User already exist",
                success:false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new User({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword
        })
        const userResponse = userData.save()

        const token = jwt.sign({ userId: userResponse._id },process.env.JWT_TOKEN)

        return res.status(200).json({
            message: "Sucessfully registered",
            token:token,
            success: true
        })
        


    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req,res)=>{
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(401).json({
                message:"Bad request",
                success:false
            })
        }
        const savedUser = await User.findOne({ email: email });
        if(await bcrypt.compare(password,savedUser.password )){
            const token = jwt.sign({ userId: savedUser._id },process.env.JWT_TOKEN)
            return res.status(200).json({
                message:"Login successful",
                success: true,
                token:token,
                email:savedUser.email
            })
        }else {return res.status(401).json({
            message:"Invalid credentials",
            success: false
        })}
    } catch (error) {
        console.log(error)
    }


})


router.post("/updatepass",async (req, res)=>{
    try {
        const { name, password, newPassword, token } = req.body;

        if (!name || !newPassword || !password || !token) {
            return res.status(401).json({
                message: "Bad request",
                success: false
            });
        }

        const decode = await jwt.verify(token, process.env.JWT_TOKEN);

        if (decode && decode.userId) {
            const savedData = await User.findById(decode.userId);
            savedData.name = name
            savedData.password = await bcrypt.hash(newPassword, 10)
            savedData.confirmPassword = await bcrypt.hash(newPassword, 10)

            if (!savedData) {
                return res.status(404).json({
                    message: "User not found",
                    success: false
                });
            }

           

            await savedData.save();

            return res.status(200).json({ message: "Password updated successfully" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
})


module.exports = router
