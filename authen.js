var users = require('./usercontrol');
var credential = require('credential');

pw = credential();

/*
 * callback function "verified" is the "done" function from "passport-local" module. 
 */

function verify(username, password, verified) {
	var user = users.getUser(username, true);

	pw.verify(user.password, password, function(isValid) {
		if(!isValid) {
			return verified(null, false, { message: 'Incorrect password.' });
		}

		return verified(null, user);
	});
}

exports.verify = verify; 