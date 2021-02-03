/** @format */

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
	const token = req.header('x-auth-token');

	if (!token)
		return res.status(401).json({
			msg: 'No token found, You are not authorized to access this resource',
		});

	try {
		const decodedToken = jwt.verify(token, config.get('jwtSecret'));
		req.user = decodedToken.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Token is not valid' });
	}
};
