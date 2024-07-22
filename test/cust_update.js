var path = require('path');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');        //__dirname = 현재 프로젝트 폴더 이름

conn = db_connect.getConnection();

let id = 'id04';
let pwd = 'pasdkj91';
let name = '김말숙';
let acc = 'adskfjkejl';
let values = [pwd,name,acc,id];

conn.query(db_sql.cust_update, values, (e, result, fields) => {
    if(e){
        console.log('Update Error');
        console.log('Error Message:' + e);
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});