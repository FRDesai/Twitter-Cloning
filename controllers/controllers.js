//writing all the logics for the routes
const User = require('../models/userModels');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const crypto = require('crypto');

const signinUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory");
    }
    const users = await User.findOne({email}) //to check if the user is already registered or not
    //compare password with hash password
    if(users && (await bcrypt.compare(password, users.password))) //if true then provide the access token in response
    {
        const accessToken = jwt.sign({
            //provide userobject as the payload
            user: {
                username: users.username,
                email: users.email,
                id: users.id,
            },//this payload will be embedded in the token
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "100m"}); 
        res.status(200).json({accessToken});
    }
    else
    {
        res.status(401)
        throw new Error("Email or password is not valid");
    }
});

const currentUser = asyncHandler(async(req, res) => {
    res.json(req.user);
});

const forgotPassword = asyncHandler(async(req, res) => {
    const Email = req.body.email;
    //check if the email exists
    const userexist = await User.findOne({ email: Email });
    if(userexist){
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpires = Date.now() + 3600000;

        const updated = await User.updateOne({ email: Email }, { $set: { resetToken: resetToken, resetTokenExpires: resetTokenExpires } });
        const resetURL = `http://localhost:3000/reset-password/:${resetToken}`;
        res.send(resetURL); 
    }
    else{
        res.status(401)
        throw new Error("Email is not registered");  
    }
});


const resetPassword = asyncHandler(async (req, res)=>{
    try {
        const { token } = req.params;
        const { password } = req.body;
        // Find the user with the matching reset token
        const users = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
        if (!users) {
          return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Update the user's password and clear the reset token
        users.password = hashedPassword;
        users.resetToken = undefined;
        users.resetTokenExpires = undefined;
        await users.save();
    
        res.status(200).json({ message: 'Password reset successful.' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
});

module.exports = { signinUser, currentUser, forgotPassword, resetPassword};