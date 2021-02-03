/** @format */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

// @route   GET api/auth
// @desc    Test route
// @access  Public

router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Passowrd is required').exists(),
	],
	async (req, res) => {
		// Pass req to express-valdator for evaluation against check requirements
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid user credentials' }],
				});
			}

			const passwordsMatch = await bcrypt.compare(password, user.password);

			if (!passwordsMatch) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid user credentials' }],
				});
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 3600 },
				(err, token) => {
					if (err) throw err;
					return res.json({ token });
				}
			);
		} catch (error) {
			return res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
