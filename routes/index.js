let express = require('express');
let router = express.Router();
let data = require('../db_interface');
let mail = require('../mail_interface');
let definition = require('../definition');
let usercontrol = require('../usercontrol');

//----------------

/* log out */
router.get('/logout', function(req, res, next) {
    req.logout();
    // delete req.session;
    res.redirect("/");
});

//----------------

/* GET signup page. */
// router.get('/signup', function(req, res, next) {
//     res.render('signup', { title: 'Circle of Safety',
//                            link_banner: definition.link_banner
//                          });
// });

//----------------

/* GET home page. */
router.get('/index', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    // console.log(req.session);
    res.render('index', { title: 'Circle of Safety',
                          user: req.user,
                          isAdmin: isAdmin,
                          isLeader: isLeader,
                          link_banner: definition.link_banner
                        });
});

//----------------

/* GET topics page. */
router.get('/topics', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    //console.log(req.session);
    res.render('topics', 
               { title: '百無禁忌',
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 link_banner: definition.link_banner
               });
});

//----------------

/* GET horizontal_give page. */
router.get('/horizontal_give', function(req, res, next) {
    let result = data.question_retrive('horizontal');
    let account = data.account_name_collect('all');
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    res.render('horizontal_give',
               { title: '同事互評', 
                 result: result,
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 account: account, 
                 link_banner: definition.link_banner, 
                 grade_value: definition.horizontal_grade_value,
                 grade_string: definition.horizontal_grade_item
               });
});
/* POST horizontal_give page. */
router.post('/horizontal_give', function(req, res, next) {
    let result = data.grade_give(req, 'horizontal');
    if(!result) {
        res.end('Fail to insert grade.');
    }

    result = data.giving_comment(req);
    if(!result) {
        res.end('Fail to insert comment.');
    }

    res.end("Thanks for giving a grade to " + req.body.account + '.');
});

//----------------

/* GET upward_give page. */
router.get('/upward_give', function(req, res, next) {
    let result = data.question_retrive('upward');
    let account = data.account_name_collect('leader');
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    res.render('upward_give', 
               { title: '向上回饋', 
                 result:result,
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader, 
                 account: account, 
                 link_banner: definition.link_banner,
                 grade_value: definition.upward_grade_value,
                 grade_string: definition.upward_grade_item
               });
});
/* POST upward_give page. */
router.post('/upward_give', function(req, res, next) {
    let result = data.grade_give(req, 'upward');
    if(!result) {
        res.end('Fail to insert grade.');
    }

    result = data.giving_comment(req);
    if(!result) {
        res.end('Fail to insert comment.');
    }

    res.end('Thanks for giving a grade to Leader ' + req.body.account + '.');
});

//----------------

/* GET grade_rawdata_list page. */
router.get('/grade_rawdata_list', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        res.render('grade_rawdata_list', 
               { title: '排行榜', 
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 link_banner: definition.link_banner
               });
    }
});

//----------------

/* GET horizontal_rawdata page. */
router.get('/horizontal_rawdata', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        let result = data.rawdata_list('horizontal');
        let q_list = data.question_retrive('horizontal');
        res.render('grade_rawdata_show', 
               { title: '同事互評排行榜', 
                 result: result,
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader, 
                 q_list: q_list, 
                 link_banner: definition.link_banner
               });
    }
});

//----------------

/* GET upward_rawdata page. */
router.get('/upward_rawdata', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        let result = data.rawdata_list('upward');
        let q_list = data.question_retrive('upward');
        res.render('grade_rawdata_show', 
               { title: '向上回饋排行榜', 
                 result: result,
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader, 
                 q_list: q_list, 
                 link_banner: definition.link_banner
               });
    }
});

//----------------

/* GET comment page. */
router.get('/comment', function(req, res, next) {
    let account = data.account_name_collect('leader');
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    res.render('comment', 
               { title: '評語',
                 user: req.user,
                 isAdmin: isAdmin,  
                 account: account,
                 isLeader: isLeader, 
                 link_banner: definition.link_banner
               });
});
/* POST comment page. */
router.post('/comment', function(req, res, next) {
    if(req.body.write == 1) {
        let result = data.giving_comment(req);
        if(!result) {
            res.end('Fail to insert comment.');
        }

        res.end("Thanks for giving a grade to " + req.body.account + '.');
    }
    else {
        let comment = data.comment_retrive(req.body.account, req.body.year, req.body.quarter);
        let isAdmin = usercontrol.isAdministrator(req.user);
        let isLeader = usercontrol.isLeader(req.user);
        let title = req.body.year + ' Q' + req.body.quarter + ' 給 ' + req.body.account + ' 的評語';
        res.render('comment_show', 
                   { title: title, 
                     user: req.user,
                     isAdmin: isAdmin,
                     isLeader: isLeader,
                     comment: comment, 
                     link_banner: definition.link_banner
                   });
    }
    
});

//----------------

/* GET result_home page. */
router.get('/upward_result', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        res.render('upward_result_home', 
               { title: '向上回饋評分管理', 
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader, 
                 link_banner: definition.link_banner
               });
    }
});

//----------------

/* GET calculate page. */
router.get('/upward_calculate', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        let account = data.account_name_collect('leader');
        res.render('upward_calculate', 
               { title: '手動結算', 
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 account: account, 
                 link_banner: definition.link_banner
               });
    }
});
/* POST calculate page. */
router.post('/upward_calculate', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let result = data.upward_calculate(req.body.account, req.body.year, req.body.quarter);
        if(!result) {
            res.end('Fail to calculate grade result.');
        }

        res.end(req.body.year + '年 第 ' + req.body.quarter + ' 季 向上回饋結算完畢');
    }
});

//----------------

/* GET upward_fullresult page. */
router.get('/upward_fullresult', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    let account = [];
    if(isAdmin) {
        account = data.account_name_collect('leader');
    }
    else if(isLeader) {
        account.push(req.user.name);
    }
    else {
        next();
    }
    res.render('upward_fullresult', 
               { title: '查詢向上回饋結果', 
                 user: req.user,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 account: account, 
                 link_banner: definition.link_banner
               });
});
/* POST upward_fullresult page. */
router.post('/upward_fullresult', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    let isLeader = usercontrol.isLeader(req.user);
    if(!isAdmin && !isLeader) {
        next();
    }
    else {
        let result = data.upward_view(req.body.account, req.body.year, req.body.quarter);
        if(result.length == 0) {
            res.end('Fail to retrive matched result.');
        }
        else {
            res.render('upward_fullresult_render', 
                   { title: '向上回饋結果', 
                     user: req.user,
                     isAdmin: isAdmin,
                     isLeader: isLeader,
                     result: result,
                     link_banner: definition.link_banner
                   });
        }
    }
});

//----------------

/* GET upward_announce page. */
router.get('/upward_announce', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        let account = data.account_name_collect('leader');
        res.render('upward_announce', 
                   { title: '通知向上回饋結果', 
                     user: req.user,
                     isAdmin: isAdmin,
                     isLeader: isLeader,
                     account: account, 
                     link_banner: definition.link_banner
                   });
    }
});
/* POST upward_announce page. */
router.post('/upward_announce', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let result = mail.inform(req.body.account, req.body.year, req.body.quarter);
        if(result == false) {
            res.end('Fail to retrive matched result.');
        }
        else {
            res.end(req.body.year + '年 第 ' + req.body.quarter + ' 季 向上回饋結果通知完畢');
        }
    }
});


//----------------

/* GET account_manage page. */
router.get('/account_manage', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let isLeader = usercontrol.isLeader(req.user);
        let account = data.account_name_collect('all');
        res.render('account_manage', 
               { title: '帳戶管理', 
                 user: req.user,
                 privelidge: usercontrol.privelidge,
                 action: usercontrol.manage_action,
                 account: account,
                 isAdmin: isAdmin,
                 isLeader: isLeader,
                 link_banner: definition.link_banner
               });
    }
});
/* POST account_manage page. */
router.post('/account_manage', function(req, res, next) {
    let isAdmin = usercontrol.isAdministrator(req.user);
    if(!isAdmin) {
        next();
    }
    else {
        let post_parameter = Object.assign({}, req.body);
        let result = usercontrol.manageUser(req.body.action, post_parameter);

        if(result == false) {
            res.end('Fail to manage account ' + post_parameter.name + '.');
        }
        else {
            res.end('Manage account ' + post_parameter.name + ' successfully!');
        }
    }
});

//----------------

module.exports = router;
