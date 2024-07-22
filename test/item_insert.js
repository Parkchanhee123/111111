var path = require('path');
var db_connect = require('../db/db_connect');
var db_sql = require('../db/db_sql');       

conn = db_connect.getConnection();

// let id = 'id04';     //id는 (자동증가 이기때문에 지정 불가)
let name = '바지06';
let price = '60000';
let imgname = 'test6.jpg';
//let regdate = new Date();               //시스템 시간은 new date() 사용
let values = [name,price,imgname];

conn.query(db_sql.item_insert, values, (e, result, fields) => {
    if(e){
        console.log('Insert Error');
        console.log('Error Message:' + e);
    }else{
        console.log('Insert OK !');
    }
    db_connect.close(conn);
});