let nodemailer=require('nodemailer');
let data = require('./db_interface');
let usercontrol=require('./usercontrol');

function inform(who, year, quarter) {
	let account = [];
	let mailer = nodemailer.createTransport('smtp://user%40mailserver:password@smtpserver');
	let question_list = data.question_retrive('upward');
	
	if(who == 'all') {
		account.push(...data.account_name_collect('leader'));
	}
	else {
		account.push(who);
	}

	for(let i=0;i<account.length;i++) {
		let result = data.upward_view(account[i], year, quarter);
		let comment = data.comment_retrive(account[i], year, quarter);
		let mailaddress = usercontrol.getUser(account[i]).email;
		let mailbody='';

		if(result.length == 0) {
			// console.log(account[i]);
			continue;
		}

		mailbody += '<head><style>body {font-family: \'Microsoft JhengHei\', \'Heiti TC\', \'WenQuanYi Zen Hei\', Helvetica;}</style><head>';
		mailbody += '<p><table border="1">\n';
		mailbody += '<tr><td><b>項目</b></td><td><b>評量總數</b></td><td><b>正評比例</b></td><td><b>中評比例</b></td><td><b>負評比例</b></td></tr>';
		for(let j=0;j<question_list.length-1;j++) {
			mailbody += '<tr>';
			mailbody += '<td>' + question_list[j+1] + '</td>';
			mailbody += '<td align="right">' + result[j].total + '</td>';
			mailbody += '<td align="right">' + result[j].favorable + '%</td>';
			mailbody += '<td align="right">' + result[j].neutral + '%</td>';
			mailbody += '<td align="right">' + result[j].unfavorable + '%</td>';
			mailbody += '</tr>';
		}
		mailbody += '</table></p>';

		mailbody += '<p><table border="1">\n';
		mailbody += '<tr><td><b>做得好的事情</b></td><td><b>可以改進的地方</b></td></tr>';
		for(let j=0;j<comment.length;j++) {
			mailbody += '<tr>';
			mailbody += '<td align="right">' + comment[j].c1 + '</td>';
			mailbody += '<td align="right">' + comment[j].c2 + '</td>';
			mailbody += '</tr>';
		}
		mailbody += '</table></p>';

		let mailOptions = {
						    from: '"Circle of Safety System" <noreply@cos.org>',
						    to: mailaddress,
						    subject: '您的 '+year+'Q'+quarter+' 向上回饋結果',
						    html: mailbody
						  };

		mailer.sendMail(mailOptions, function(error, info) {
							    if(error){
							        console.log(error);
							    }
							    else {
							    	console.log('Message sent ok');
							    }
							    
							});
	}
	
	mailer.close();
	return true;
}

exports.inform = inform;