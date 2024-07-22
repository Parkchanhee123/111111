const { cust_insert } = require("../db/db_sql");

var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');       //__dirname = 현재 프로젝트 폴더 이름

conn = db_connect.getConnection();

conn.query(db_sql.cust_select, function (err, result, fields) {

    if (err) {                                //에러시 결과 날아옴(ex) db가 죽어있을때)
        console.log('Select Error');
        console.log('Error Message:' + err);
    } else {
        console.log(result);                        //일반 결과 받음
        console.log(JSON.stringify(result));        //json으로도 결과 받음
    }
    db_connect.close(conn);

});

