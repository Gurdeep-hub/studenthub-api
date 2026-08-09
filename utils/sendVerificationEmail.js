const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: gmail,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendVerificationEmail = async (email,token)=>{
    const verificationUrl = `http://localhost:5000/api/auth/verify/${token}`;
    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : email,
        subject : "verify your email",
        html : `
         <h2>Welcome to StudentHub!</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link expires in 15 minutes.</p>
        `
    });
};

module.exports = sendVerificationEmail;