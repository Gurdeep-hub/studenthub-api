const User = require('../modals/User');
const bcrypt = require('bcrypt');

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
        // const verificationToken = jwt.sign(
        //     { userId: user._id },
        //     process.env.EMAIL_VERIFICATION_SECRET,
        //     { expiresIn: "15m" }
        // );
        // await sendVerificationEmail(user.email, verificationToken);

        return res.status(201).json({
            message: "Registration successful. Please verify your email."
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
}