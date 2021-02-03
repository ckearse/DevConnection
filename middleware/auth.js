/** @format */

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	//Get token from header
	const token = req.header('x-auth-token');

	//Check if no token; if no token, then return res.status(401)
	if (!token)
		return res.status(401).json({
			msg: 'No token found, You are not authorized to access this resource',
		});

	//Verify token, if found
	try {
		const decodedToken = jwt.verify(token, config.get('jwtSecret'));
		console.log('USER: ', req.user);
		req.user = decodedToken.user; //as we return the user_id with token
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
