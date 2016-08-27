var users = require('./usercontrol');
var credential = require('credential');

pw = credential();

/*
 * callback function "verified" is the "done" function from "passport-local" module. 
 */

function verify(username, password, verified) {
	var user = users.getUser(username, true);

	// temp use
	if(!user) {
		return verified(null, false, { message: 'Incorrect username.' });
	}


	if(password != user.password) {
		return verified(null, false, { message: 'Incorrect password.' });
	}
	return verified(null, user);
	
	// to be completed, credential 1.0.0 has bugs. Fixed in 2.0.0#70(use SHA1 digest with pbkdf2 method) but not published in NPM yet.
	// (node:641) DeprecationWarning: crypto.pbkdf2 without specifying a digest is deprecated. Please specify a digest
	// pw.verify(user.pass_hash, password, function(isValid) {
	pw.verify(user.password, password, function(isValid) {
		if(!isValid) {
			return verified(null, false, { message: 'Incorrect password.' });
		}

		return verified(null, user);
	});
}

exports.verify = verify; 