let sql = require('./postgressql');
let usercontrol = require('./usercontrol');

function question_retrive(type) {
	let rows;
    let command = '';
    let result = [];

    command += 'SELECT * FROM ' + type + '_question where question_ver = (select MAX(question_ver) from ' + type + '_question)';
    rows = sql.excute(command);

    if(rows.length == 0) {
        return ['Data empty'];
    }
    result.push(rows[0].question_ver);
    for(let i=0;i<rows.length;i++) {
        result.push(rows[i].description);
    }

    return result;
}

function account_name_collect(type) {
    let rows;
    let command = '';
    let result = [];
    let condition_sqlstring;

    if(type === 'all') { // non-admin
        condition_sqlstring = 'WHERE "group" = ' + usercontrol.privelidge.leader;
        condition_sqlstring += ' OR "group" = ' + usercontrol.privelidge.leader_admin;
        condition_sqlstring += ' OR "group" = ' + usercontrol.privelidge.normal;
    }
    else if(type === 'normal') {
        condition_sqlstring = 'WHERE "group" = ' + usercontrol.privelidge.normal;
    }
    else if(type === 'leader') {
        condition_sqlstring = 'WHERE "group" = ' + usercontrol.privelidge.leader;
        condition_sqlstring += ' OR "group" = ' + usercontrol.privelidge.leader_admin;
    }
    else if(type === 'admin') {
        condition_sqlstring = 'WHERE "group" = ' + usercontrol.privelidge.admin;
        condition_sqlstring += ' OR "group" = ' + usercontrol.privelidge.leader_admin;
    }

    command += 'SELECT name FROM account ' + condition_sqlstring + ' ORDER BY name ASC';
    rows = sql.excute(command);

    for(let i=0;i<rows.length;i++) {
        result.push(rows[i].name);
    }
    return result;
}

function account_retrive() {
    return sql.excute('SELECT * FROM account ORDER BY name ASC');
}

function account_lookup(username) {
    let rows;
    let command = '';
    let result;

    command += 'SELECT * FROM account where name=\'' + username + '\'';
    rows = sql.excute(command);

    if(rows.length == 0) {
        result = null;
    }
    else {
        result = rows[0];
    }

    return result;
}

function account_create(data) {
    let command = 'INSERT INTO account (name, password, employeeno, arrivedate, email, \"group\") VALUES ';
    command += '(' +
               '\'' + data.name +'\', ' +
               '\'' + data.password +'\', ' +
               '\'' + data.employee_no +'\', ' +
               '\'' + data.arrivedate +'\', ' +
               '\'' + data.email +'\', ' +
               Number(data.group) +
               ')';

    sql.excute(command);

    return true; // should do error handling
}

function account_modify(data) {
    let command = 'UPDATE account SET ';
    command += 'name = \'' + data.name + '\', ' +
               'password = \'' + data.password + '\', ' +
               'employeeno = \'' + data.employee_no + '\', ' +
               'arrivedate = \'' + data.arrivedate + '\', ' +
               'email = \'' + data.email + '\', ' +
               '\"group\" = \'' + data.group + '\' ';
    command += 'WHERE name = \'' + data.oldname + '\'';

    sql.excute(command);

    return true; // should do error handling
}

function account_delete(data) {
    let command = 'DELETE FROM account where name = \'' + data.name + '\'';
    
    sql.excute(command);

    return true; // should do error handling
}

function grade_give(req, type) {
    let q_list = question_retrive(type);
    let command = '';
    let value_sqlstring = '';

    if(req.body.account === req.body.provider) {
        return false; // here should throw something to let caller know what happens
    }

    let locate_sqlstring = 'WHERE ' +
                            'candidate = \'' + req.body.account + '\' and ' +
                            'provider = \'' + req.body.provider + '\' and ' +
                            'year = ' + req.body.year + ' and ' +
                            'quarter = ' + req.body.quarter;
    let rows = sql.excute('SELECT FROM ' + type + '_grade ' + locate_sqlstring);
    
    if(rows.length != 0) {
        let grade_update_sqlstring = '';

        for(let i=1;i<q_list.length;i++) {
            grade_update_sqlstring += 'grade' + i + '=' + req.body['grade'+i]; 
            if(i < (q_list.length-1)) {
                grade_update_sqlstring += ', ';
            }
        }

        command += 'UPDATE ' + type + '_grade SET ' +
                   'question_ver=' + req.body.question_ver + ', ' +
                   'apply_time=\'now()\', ' +
                   grade_update_sqlstring + ' ' +
                   locate_sqlstring;
    }
    else {
        let grade_column_sqlstring = '';
        let grade_value_sqlstring = '';

        for(let i=1;i<q_list.length;i++) {
            grade_column_sqlstring += ', grade' + i; 
            grade_value_sqlstring += ', ' + req.body['grade'+i];
        }
        
        value_sqlstring += '('  + 
                            '\'' + req.body.account      + '\', ' + 
                                   req.body.question_ver + ', ' +
                            '\'now()\', ' +
                            '\'' + req.body.provider     + '\',' +
                            req.body.year + ', ' +
                            req.body.quarter +
                            grade_value_sqlstring +
                            ')';
        
        command += 'INSERT INTO ' + type + '_grade ' + 
                   '(candidate, question_ver, apply_time, provider, year, quarter' + 
                   grade_column_sqlstring + ') ' +
                   'VALUES ' + value_sqlstring;
    }
    sql.excute(command);

    return true; // should do error handling
}

function giving_comment(req) {
    let command = '';
    let value_sqlstring = '';
    
    if( (req.body.good.length == 0) && (req.body.improve.length == 0) ) {
        return true;
    }

    if(req.body.account === req.body.provider) {
        return false; // here should throw something to let caller know what happens
    }

    let locate_sqlstring = 'WHERE ' +
                            'candidate = \'' + req.body.account + '\' and ' +
                            'provider = \'' + req.body.provider + '\' and ' +
                            'year = ' + req.body.year + ' and ' +
                            'quarter = ' + req.body.quarter;
    let rows = sql.excute('SELECT FROM comment ' + locate_sqlstring);

    if(rows.length != 0) {
        command += 'UPDATE comment SET ' +
                   'good_thing=\'' + req.body.good + '\', ' +
                   'to_improve=\'' + req.body.improve + '\', ' +
                   'apply_time=\'now()\' ' +
                   locate_sqlstring;
    }
    else {
        value_sqlstring += '('  +
                           '\'' + req.body.account  + '\', ' +
                           '\'now()\', ' +
                           '\'' + req.body.provider + '\', ' +
                           '\'' + req.body.good + '\', ' +
                           '\'' + req.body.improve + '\', ' +
                           req.body.year + ', ' +
                           req.body.quarter +
                           ')';

        command += 'INSERT INTO comment ' +
                   '(candidate, apply_time, provider, good_thing, to_improve, year, quarter) ' +
                   'VALUES ' + value_sqlstring;
    }
    sql.excute(command);

    return true; // should do error handling
}

function rawdata_list(type) {
    let rows;
    let command = '';
    let q_list = question_retrive(type);
    let select_sqlstring = 'SELECT candidate';

    for(let i=1;i<q_list.length;i++) {
        select_sqlstring += ', sum(grade' + i + ') AS G' + i;
    }

    command += select_sqlstring + ' FROM ' + type + '_grade GROUP BY candidate ORDER BY candidate ASC';
    rows = sql.excute(command);

    return rows;
}

function comment_retrive(account, year, quarter) {
    let rows;
    let command = '';
    let select_sqlstring = 'SELECT ';
    let condition_sqlstring = 'WHERE ';

    select_sqlstring += 'good_thing AS C1, ';
    select_sqlstring += 'to_improve AS C2';

    condition_sqlstring += 'candidate = \'' + account + '\'';
    condition_sqlstring += ' AND year = ' + year;
    condition_sqlstring += ' AND quarter = ' + quarter;

    command += select_sqlstring + ' FROM comment ' + condition_sqlstring;
    rows = sql.excute(command);

    return rows;
}

// should be replaced by some exist API or collected in a utility js.
function percentage(fractions, numerator) {
    return fractions / numerator * 100;
}

function upward_calculate(who, year, quarter) {
    let account;
    let candidate_name;
    let question_list = question_retrive('upward');
    let question_count = question_list.length - 1;
    let grade_cmd_string = {'favor':'>0', 'unfavor':'<0', 'neural':'=0'};

    if(who == 'all') {
        account = account_name_collect('leader');
        account_iteration = account.length;
    }
    else {
        account_iteration = 1;
    }

    for(let i=0;i<account_iteration;i++) {
        
        if(who == 'all') {
            candidate_name = account[i];
        }
        else {
            candidate_name = who;
        }

        for(let j=1;j<=question_count;j++) {
            let favor_total, neural_total, unfavor_total;
            let favor_percent, neural_percent, unfavor_percent;
            let total=0;
            let command='';
            let rows;

            command = 'SELECT count(grade' + j + ') FROM upward_grade';
            command += ' WHERE candidate=\'' + candidate_name + '\'';
            command += ' AND year = ' + year;
            command += ' AND quarter = ' + quarter;
            command += ' AND grade' + j;

            rows = sql.excute(command + grade_cmd_string.favor);
            favor_total = Number(rows[0].count);

            rows = sql.excute(command + grade_cmd_string.neural);
            neural_total = Number(rows[0].count);
            
            rows = sql.excute(command + grade_cmd_string.unfavor);
            unfavor_total = Number(rows[0].count);

            total = favor_total + neural_total + unfavor_total;

            if(total == 0) {
                continue;
            }

            favor_percent = Math.round(percentage(favor_total, total));
            unfavor_percent = Math.round(percentage(unfavor_total, total));
            neural_percent = 100 - favor_percent - unfavor_percent;

            rows = sql.excute('SELECT * FROM upward_result WHERE candidate=\'' +
                              candidate_name + '\' AND year=' + year + ' AND quarter=' +
                              quarter + ' AND grade_num='+ j + ' AND question_ver=' + question_list[0]);
            
            if(rows.length == 0) {
                command = 'INSERT INTO upward_result ' +
                          '(candidate, year, quarter, total, favorable, neutral, unfavorable, question_ver, grade_num) ';
                command += 'VALUES (' + 
                           '\'' + candidate_name + '\', ' +
                           year + ', ' +
                           quarter + ', ' +
                           total + ', ' +
                           favor_percent + ', ' +
                           neural_percent + ', ' +
                           unfavor_percent + ', ' +
                           question_list[0] + ', ' +
                           j +
                           ')';
            }
            else {
                command = 'UPDATE upward_result SET ';
                command += 'total=' + total +
                           ', favorable=' + favor_percent +
                           ', unfavorable=' + unfavor_percent +
                           ', neutral=' + neural_percent;
                command += ' WHERE candidate=\'' + candidate_name + '\'' +
                           ' and year=' + year +
                           ' and quarter=' + quarter +
                           ' and question_ver=' + question_list[0] +
                           ' and grade_num=' + j;
            }

            sql.excute(command);
        }
    }

    return true; // should do error handling
}

function upward_view(who, year, quarter) {
    let account;
    let candidate_name;
    let question_list = question_retrive('upward');
    let question_count = question_list.length - 1;
    let result=[];

    if(who == 'all') {
        account = account_name_collect('leader');
        account_iteration = account.length;
    }
    else {
        account_iteration = 1;
    }

    for(let i=0;i<account_iteration;i++) {
        let command='';
        let rows;
        
        if(who == 'all') {
            candidate_name = account[i];
        }
        else {
            candidate_name = who;
        }

        command = 'SELECT * FROM upward_result';
        command += ' WHERE candidate=\'' + candidate_name + '\'';
        command += ' AND year = ' + year;
        command += ' AND quarter = ' + quarter;
        command += ' ORDER BY grade_num';

        rows = sql.excute(command);
        if( rows.length != 0 ) {
            // console.log(rows[0]);
            result = result.concat(rows);
        }
    }

    // console.log(result.length);

    return result;
}


exports.question_retrive = question_retrive;
exports.account_retrive = account_retrive;
exports.account_name_collect = account_name_collect;
exports.account_lookup = account_lookup;
exports.account_create = account_create;
exports.account_modify = account_modify;
exports.account_delete = account_delete;

exports.grade_give = grade_give;
exports.rawdata_list = rawdata_list;

exports.giving_comment = giving_comment;
exports.comment_retrive = comment_retrive;

exports.upward_calculate = upward_calculate;
exports.upward_view = upward_view;