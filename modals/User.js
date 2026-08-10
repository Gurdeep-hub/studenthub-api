const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },


        refreshToken: {
            type: String,
            default: "",
        },
        roles: {
            type: [Number],
            default: [2001]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);