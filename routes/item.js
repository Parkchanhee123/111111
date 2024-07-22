const express = require('express');
const app = express();
const router = express.Router();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')

var goto = require('../util/goto');

// Database 연동
var db_connect = require('../db/db_connect.js');
var db_sql = require('../db/db_sql');

//multer 패키지 사용
const multer = require('multer')
const limits = {
    fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
    filedSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
    fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
    fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
    files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
}
// 파일 경로 및 이름 설정 옵션
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img') // 파일 업로드 경로
    },     // public폴더 밑에 이미지를 저장함
    filename: function (req, file, cb) {
        cb(null, file.originalname) //파일 이름 설정
    }
})
const upload = multer({
    storage: storage
})

router
    .get("/", (req, res) => {
        conn = db_connect.getConnection();
        conn.query(db_sql.item_select, function (e, result, fields) {
            try {
                if (e) {
                    console.log('select Error');
                    throw e;
                } else {
                    goto.go(req, res, { 'center': 'item/list', 'datas': result });
                }
            } catch (e) {
                console.log(e);
            } finally {
                db_connect.close(conn);
            }
        })
    })
    .get("/detail",(req,res)=>{   // 127.0.0.1/item/add
        let id = req.query.id;
        conn = db_connect.getConnection();
        conn.query(db_sql.item_select_one, id, (err, result, fields) => {
            try{
                if(err){
                    console.log('Select Error');
                    throw err;
                }else{
                    console.log(result);
                    goto.go(req,res,{'center':'item/detail', 'iteminfo':result[0]});   
                }                                                   //배열 형식으로 가져옴
            }catch(err){
                console.log(err);
            }finally{
                db_connect.close(conn);
            }
        
        });
    })


    .get("/add", (req, res) => {       // localhost/item/add 라고 호출됐을때 실행
        goto.go(req, res, { 'center': 'item/add' });
        // res.render('index', {'center' : 'item/add'})
    })
    // 화면에서 입력한 파일을 서버로 가져오는 역할
    .post("/addimpl", upload.single('img'), (req, res) => {
        let name = req.body.name;
        let price = req.body.price;
        const { originalname } = req.file
        console.log(`input data ${name}, ${price}, ${originalname}`);
        let values = [name, price, originalname];
        conn = db_connect.getConnection();
        conn.query(db_sql.item_insert, values, (e, result, fields) => {
            try {
                if (e) {
                    console.log('Insert Error');
                    throw e;
                } else {
                    console.log('Insert OK !');
                    res.redirect('/item');
                }
            } catch (e) {
                console.log(e);
            } finally {
                db_connect.close(conn);
            }
        });
    })

    .post("/updateimpl", upload.single('img'), (req, res) => {
        let id = req.body.id;
        let name = req.body.name;
        let price = req.body.price;
        let oldname = req.body.oldname;
        let values = [name, price, oldname, id];
        console.log(`input data ${name}, ${price}, ${oldname}, ${originalname}`);

        if (req.file != undefined) {
            const { originalname } = req.file
            values = [name, price, originalname, id];
        }

        conn = db_connect.getConnection();
        conn.query(db_sql.item_update, values, (e, result, fields) => {
            try {
                if (e) {
                    console.log('Insert Error');
                    throw e;
                } else {
                    console.log('Insert OK !');
                    res.redirect('/item/detail?id=' + id);
                }
            } catch (e) {
                console.log(e);
            } finally {
                db_connect.close(conn);
            }
        });
    });

module.exports = router;