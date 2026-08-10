const User = require('../modals/User');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendVerificationEmail"); 

const register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (existingUser) {
            return res.status(409).json({
                message: "username or email aready exists"
            })
        }
        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPwd
        })
        const verificationToken = jwt.sign(
            { userId: user._id },
            process.env.EMAIL_VERIFICATION_SECRET,
            { expiresIn: "15m" }
        );
        await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({
            message: "Registration successful. Please verify your email."
        });
    } catch (error) {
        next(error);
    }
}

const verifyEmail = async (req,res,next)=>{
    try{
    const {token} = req.params;
    const decoded = jwt.verify(
        token,
        process.env.EMAIL_VERIFICATION_SECRET
    )
    const user = await User.findById(decoded.userId);
    if(!user){
        return res.status(404).json({
            message : "user not found"
        })
    }
    if(user.isVerified){
        return res.status(400).json({
            message : "user is already verified"
        })
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
        message : "email verified successfully"
    })
    }catch(error){
          if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "Verification token has expired"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                message: "Invalid verification token"
            });
        }
        next(error);
    }
}

const login = async (req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
          if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )
        if(!passwordMatch){
            return res.status(401).json({
                message : "invalid email or password"
            });
        }
        const accessToken = jwt.sign({
            userId : user._id,
            email : user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : "15m"}
    );
        const refreshToken = jwt.sign({
            userId : user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : "7d"}
    );
    user.refreshToken = refreshToken;
    await user.save();
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    verifyEmail,
    login
}