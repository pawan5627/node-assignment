const User = require("../models/user")
const { validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


exports.signup = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    user.save((err, newuser) => {
        if (err) {
            return res.status(400).json({
                error: "Email address already used"
            })
        }
        const { _id, name, email, phonenumber, role, createdAt } = newuser
        // generate a token 
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_KEY, {
            expiresIn: '15m'
        })
        //save token into a cookie, the token expires after a day
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        })
        return res.json({
            message: "Sign up successful",
            user: {
                _id,
                role,
                name,
                email,
                phonenumber,
                createdAt
            }
        })
    })
}


exports.signin = (req, res) => {
    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email Address not found"
            })
        }
        if (user.account_status === "inactive") {
            return res.status(400).json({
                error: "This account has been deleted"
            })
        }
        // check if user's email and password are correct       
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email Address or Password is incorrect"
            })
        }

        // generate a token 
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_KEY, {
            expiresIn: '15m'
        })

        //save token into a cookie, the token expires after a day
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true
        })

        //send response
        const { _id, name, email, phonenumber, role, createdAt } = user
        return res.json({
            message: "Signed in successfully",
            token,
            user: {
                _id,
                name,
                email,
                phonenumber, 
                role,
                createdAt
            }
        })
    })
}

exports.signout = (req, res) => {
    // res.clearCookie("token")
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    //req.session = null
    return res.json({
        message: "User signed out successfully."
    })
}

// View your Profile
exports.getprofile = (req, res) => {
    User.findOne({ _id: req.user._id }, (err, user) => {
        const { _id, name, email, phonenumber, role, createdAt } = user
        return res.status(200).json({
            message: "Route to User Profile Successful",
            user: {
                _id,
                name,
                email,
                phonenumber, 
                role,
                createdAt
            }
        })
        if(err)
        return res.status(500).json(err);
    })
}

// Update your profile  
exports.updateProfile = (req, res) => {
    const { token } = req.cookies
    const { name, phonenumber, email } = req.body;
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    User.findOneAndUpdate(
        { _id: { $eq: decoded._id } },
        { name, phonenumber, email }, // data to be updated
        { new: true, useFindAndModify: false }
    )
        .then(user => {
            const { _id, name, phonenumber, email, role, createdAt} = user
            res.status(200).json({
                success: true,
                user: {
                    _id,
                    name,
                    phonenumber,
                    email,
                    role,
                    createdAt
                }
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}

// Delete your account - For any user
exports.deleteYourAccount = catchAsyncErrors(async (req, res) => {
    // const { token } = req.cookies
    // const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log(decoded._id)
    // console.log(decoded.status)
    // console.log(req.user._id)
    // console.log(req.user.status)
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    // console.log(req.user._id)
    // console.log(user.status)
    updateduser = await User.findByIdAndUpdate(req.user._id, { account_status: "inactive" }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Account Deleted Successfully"
        //updateduser
    })
})


// Update user profile -- For Admins
exports.updateUser = (req, res) => {

    User.findOneAndUpdate(
        { $and: [{ _id: { $eq: req.params.id } }, { role: "user" }] }, // Find one id equals to id in params
        req.body, // data to be updated
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    )
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    message: "You cannot update an admin"
                })
            }
            return res.status(200).json({
                success: true,
                user
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}

// get all users -- For Admins
exports.getAllUsers = (req, res) => {
    User.find()
        .then(users => {
            // let type = typeof users;
            // console.log(type)
            res.status(200).json({
                success: true,
                users
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}

// Get user details -- For admins
exports.getUserDetails = (req, res) => {

    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
            return res.status(200).json({
                success: true,
                user
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}


// Deactivate a user -- For Admins
exports.deactivateUser = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    if (user.role == "user") {
        const updateduser = await User.findByIdAndUpdate(req.params.id, { account_status: "inactive" }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            user: updateduser
        })
    }
    else {
        return res.status(200).json({
            message: "You cannot update an admin"
        })
    }
})


// Update any user's profile 
exports.updateAnyUser = (req, res) => {
    const { name, phonenumber, email, role } = req.body;
    User.findOneAndUpdate(
        { $and: [{ _id: { $eq: req.params.id } }, { $or: [{ role: "user" }, { role: "admin" }] }] }, // Find one id equals to id in params
        { name, phonenumber, email, role }, // data to be updated
        { new: true, useFindAndModify: false } // to mongoose returns the updated document
    )
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    message: "You cannot update a superadmin"
                })
            }
            return res.status(200).json({
                success: true,
                user
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}

// Deactivate any user
exports.deactivateAnyUser = (req, res) => {
    User.findOneAndUpdate(
        { $and: [{ _id: { $eq: req.params.id } }, { $or: [{ role: "user" }, { role: "admin" }] }] }, // Find one id equals to id in params and role equal to user
        { account_status: "inactive" }, // data to be updated
        { new: true, useFindAndModify: false } // to mongoose returns the updated document
    )
        .then(user => {
            if (!user) {
                return res.status(200).json({
                    message: "You cannot update a superadmin"
                })
            }
            res.status(200).json({
                success: true,
                user
            })
        })
        .catch(error => {
            return res.status(500).json(error);
        });
}