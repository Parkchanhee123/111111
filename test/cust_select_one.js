const { cust_insert } = require("../db/db_sql");

var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');       //__dirname = 현재 프로젝트 폴더 이름

conn = db_connect.getConnection();
let id = 'id01';

conn.query(db_sql.cust_select_one, id, (err, result, fields) => {

    if(err){
        console.log('Select Error');
        console.log('Error Message:')+e;
    }else{
        console.log(result);
        console.log(JSON.stringify(result));
    }

    db_connect.close(conn);

});