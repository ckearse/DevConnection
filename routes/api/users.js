const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { findOne } = require('../../models/Users');
const User = require('../../models/Users');

// @route   POST api/users
// @desc    Register User
// @access  Public

router.get('/', (req, res) => {
  res.send("Users Route")
})

router.post('/', 
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({min: 6})
  ],
  async (req, res) => {
    console.log("Request Body", req.body);

    // Pass req to express-valdator for evaluation against check requirements
    const errors = validationResult(req);

    console.log("Errors", errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body;

    try {
      // Additional validation checks
    /* 
      x: Does user already exist? if so, return error for duplicate user
      -: Get users profile image via gravatar
      -: Encrypt password
      -: Return jsonwebtoken
    */

    let user = await User.findOne({email});

    if(user) {
      res.status(400).json({
        errors: [
          {msg: 'User already exists'}
        ]
      });
    }

    const avatar = gravatar.url(email, {
      s: '200', // size in pixels squared
      r: 'pg', // limit images to those rated pg only 
      d: 'mm' // provides some default image if no avatar image found
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    } catch (error) {
      console.log("Error", error);
      return res.status(500).send("Server Error");
    }


    return res.send("User Registered");
});

module.exports = router;