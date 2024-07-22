var path = require('path');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');        //__dirname = 현재 프로젝트 폴더 이름

conn = db_connect.getConnection();

let id = '6';
let price = '90000';
let name = '김말숙';
let imgname = 'test9.jpg';
let values = [name,price,imgname, id];

conn.query(db_sql.item_update, values, (e, result, fields) => {
    if(e){
        console.log('Update Error');
        console.log('Error Message:' + e);
    }else{
        console.log('Update OK !');
    }
    db_connect.close(conn);
});