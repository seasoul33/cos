let data = require('./db_interface');

const manage_action = {'create': 1,
                'modify': 2,
                'delete': 3}

const privelidge = 	{'normal': 1,
                  	 'leader': 2,
                  	 'admin': 3,
                  	 'leader_admin': 5
                 	}

let credential = require('credential');
pw = credential();

function manageUser(action, user) {
	if(action == manage_action.create) {
		pw.hash(user.password, function(err, hash) {
			user.password = hash;
			data.account_create(user);
		});
		
	}
	else if(action == manage_action.modify) {
		if(user.password == '') {
			let original_user = getUser(user.name, true);
			if(original_user != null) {
				user.password = original_user.password;
			}
			data.account_modify(user);
		}
		else {
			pw.hash(user.password, function(err, hash) {
				user.password = hash;
				data.account_modify(user);
			});
		}
	}
	else if(action == manage_action.delete) {
		if(user.name == 'admin') {
			return false;
		}
		data.account_delete(user);
	}
}

function getUser(username, need_password) {
	let user=data.account_lookup(username);

	if(user == null) {
		return null;
	}
	else {
		if(!need_password) {
			user.password = '';  // Do not expose users' password for security.
		}
		return user;
	}
}

function getAccountnameList(type, need_admin) {
	let user=data.account_name_collect(type);

	if(user == null) {
		return null;
	}
	else {
		if(!need_admin) {
			return user.filter(function(name) {
				   					return (name != 'admin');
				   			   });
		}
		return user;
	}
}

function isAdministrator(user) {
	if( (user.group === privelidge.admin) ||
	    (user.group === privelidge.leader_admin) ) {
		return true;
	}
	return false;
}

function isLeader(user) {
	if( (user.group === privelidge.leader) ||
	    (user.group === privelidge.leader_admin) ) {
		return true;
	}
	return false;
}

exports.manageUser = manageUser;
exports.getUser = getUser;
exports.getAccountnameList = getAccountnameList;
exports.isAdministrator = isAdministrator;
exports.isLeader = isLeader;
exports.privelidge = privelidge;
exports.manage_action = manage_action;