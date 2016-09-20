var users = require('./usercontrol');
var credential = require('credential');

pw = credential();

/*
 * callback function "verified" is the "done" function from "passport-local" module. 
 */
function verify(username, password, verified) {
	let user = users.getUser(username, true);

	if((username === 'admin') && (!user)) {
		let newuser = { name: 'admin', 
		                password: password,
		                group: users.privelidge.admin,
		                employee_no: '000000',
		                arrivedate: '2000-01-01',
		                email: 'admin@xxx.xxx'
		              };
		users.manageUser(users.manage_action.create, newuser);

		return verified(null, newuser);
	}

	pw.verify(user.password, password, function(err, isValid) {
		if(err) {
			return verified(null, false, { message: 'Stored password broken.' });
		}
		if(!isValid) {
			return verified(null, false, { message: 'Incorrect password.' });
		}

		return verified(null, user);
	});
}

exports.verify = verify; 