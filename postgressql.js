let pg = require('pg-native');
let conString = "postgresql://user:password@localhost/cosdb";

function excute(command) {
    // sync connect
    let client = new pg();
    client.connectSync(conString);
    let rows = client.querySync(command);

    client.end();
    return rows;

/*
    // async connect
    pg.connect(conString, function(err, client, done) {
        client.on('error', function(error) {
            console.log(error);
            done();
            return ['DB Error'];
        }); 

        client.query('SELECT description FROM horizontal_question', function(err, DB_result) {
            done();
            if(DB_result) {
                for(let i=0;i<DB_result.rows.length;i++) {
                    result.push(DB_result.rows[i].description);
                }
                console.log(result);
                return result;
            }
            else {
                return ['Data empty'];
            }
        });
    });
    //client.end();
*/
}

exports.excute = excute;