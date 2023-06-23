//writing all the logics for the routes
const user = require('../models/userModels');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");

const signinUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory");
    }
    const users = await user.findOne({email}) //to check if the user is already registered or not
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
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "100m"}
        ); 

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

module.exports = { signinUser, currentUser};