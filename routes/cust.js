const express = require('express');
const app = express();
const router = express.Router();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')

var goto = require('../util/goto');

// Database 연동
var db_connect = require('../db/db_connect.js');
var db_sql = require('../db/db_sql');

router
    .get("/", (req, res) => {       // localhost/cust/ 라고 호출됐을때 함수가 실행

        conn = db_connect.getConnection();

        conn.query(db_sql.cust_select, function (err, result, fields) {
            try {
                goto.go(req,res, { center: 'cust/list', datas: result });               //여기에 넣어줌
            }catch (e){
                console.log(e);
            }finally {
                db_connect.close(conn)
            }
            console.log(err);
        });
    })

    .get("/add", (req, res) => {       // localhost/cust/add 라고 호출됐을때 이부분
        goto.go(req,res,  { 'center': 'cust/add' });

        // res.render('index', { 'center': 'cust/add' })
    })

    .get("/deleteimpl", (req, res) => {
        let id = req.query.id;      //get방식에서는 query, post에서는 body로 값을 꺼내옴
        conn = db_connect.getConnection();

        conn.query(db_sql.cust_delete, id, (err, result, fields) => {
            try {
                if (err) {
                    console.log('Delete Error');
                    throw err;
                } else {
                    console.log('Delete OK !');
                    res.redirect('/cust');
                    console.log(id);
                }
            } catch (err) {
                console.log(err);
            } finally {
                db_connect.close(conn);
            }
        })
    })

    .get("/detail", (req, res) => {       // localhost/cust/detail
        let id = req.query.id       //get방식은 쿼리에다 요청
        conn = db_connect.getConnection();
        conn.query(db_sql.cust_select_one, id, function (err, result, fields) {

            try {
                if (err) {                                //에러시 결과 날아옴(ex) db가 죽어있을때)
                    console.log('Select Error');
                    throw err;
    
                } else {
                    
                    console.log(result);
                    custinfo = result[0];
                    goto.go(req,res, { 'center': 'cust/detail', 'custinfo': custinfo });         
                    // res.render('index', { 'center': 'cust/detail', 'custinfo': custinfo })
                }
            }catch (err) {
                console.log(err);
            }finally {
                db_connect.close(conn);
            }
        });
    })

    .post("/updateimpl", (req, res) => {

        let id = req.body.id;        //post 방식일때는 body에서 가져옴
        let pwd = req.body.pwd;
        let name = req.body.name;
        let acc = req.body.acc;
        console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
        let values = [pwd, name, acc, id];

        conn = db_connect.getConnection();

        conn.query(db_sql.cust_update, values, (e, result, fields) => {
            try {
                if (e) {
                    console.log('Insert Error');
                    throw e;
                } else {
                    console.log('Insert OK !');
                    res.redirect('/cust/detail?id='+id);            //기존에 서버에 만들어뒀던걸 리다이렉트
                }
            }catch {
                console.log(e);
            }finally {
                db_connect.close(conn);
            }
        })
    })

    .post("/addimpl", (req, res) => {

        let id = req.body.id;        //post 방식일때는 body에서 가져옴
        let pwd = req.body.pwd;
        let name = req.body.name;
        let acc = req.body.acc;
        console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
        let values = [id, pwd, name, acc];

        conn = db_connect.getConnection();

        conn.query(db_sql.cust_insert, values, (e, result, fields) => {
            try {
                if (e) {
                    console.log('Insert Error');
                } else {
                    console.log('Insert OK !');
                    res.redirect('/cust');            //기존에 서버에 만들어뒀던걸 리다이렉트
                }
            }catch {
                console.log('Error Message:' + e);

            } finally {
                db_connect.close(conn);
            }
        })
    });



module.exports = router;