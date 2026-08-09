const z = require('zod');
const registerSchema = z.object({
    username : z
    .string()
    .min(3,'username must be 3 characters')
    .max(20,'username cannot exceed 20 characters'),

    email : z.email('invalid email'),
    password : z.string().min(6,'passowrd must be 6 characters')
})

const loginSchema = z.object({
    email : z.email(),
    password : z.string().min(6)
})


module.exports = {registerSchema,loginSchema};