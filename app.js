require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')   //body parser 추가 1
const app = express();
const port = process.env.SERVER_PORT || 8080;

var goto = require('./util/goto');      // 자바 스크립트 변수선언 var(구),let(신)

// express lib
const session = require('express-session');

// session 저장소 지정(메모리)
const MemoryStore = require("memorystore")(session);
// Passport lib 
const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

// Database 연동
var db_connect = require('./db/db_connect');
var db_sql = require('./db/db_sql');

//html 환경설정, post, public 디렉토리를 세팅해주는 함수
app.set('view engine', 'html');     // 화면의 확장자는 html
app.use(bodyParser.urlencoded({ extended: false })); //객체 들어감. 추가 2 
app.use(express.static('public'));


//html과 관련된 화면정보를 views라는 폴더에 작성하겠다
nunjucks.configure('views', {
    express: app,
})

// Session 선언
app.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,

        store: new MemoryStore({
            checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
        })
    })
);

// 2. Passport를 이용한 로그인 처리 ---------------------------------------------------------------------------------------

// passport 초기화 및 session 연결
app.use(passport.initialize());
app.use(passport.session());

// login이 최초로 성공했을 때만 호출되는 함수
// done(null, user.id)로 세션을 초기화 한다.
passport.serializeUser(function (req, user, done) {
    console.log('serializeUser' + user);
    console.log('serializeUser' + user.id);
    console.log('serializeUser' + user.name);
    console.log('serializeUser' + user.acc);

    done(null, user);
});

// 사용자가 페이지를 방문할 때마다 호출되는 함수
// done(null, id)로 사용자의 정보를 각 request의 user 변수에 넣어준다.
passport.deserializeUser(function (req, user, done) {
    console.log('Login User' + user.name + ' ' + user.id);
    done(null, user);
});

// local login 전략을 세우는 함수
// client에서 전송되는 변수의 이름이 각각 id, pw이므로 
// usernameField, passwordField에서 해당 변수의 값을 받음
// 이후부터는 username, password에 각각 전송받은 값이 전달됨
// 위에서 만든 login 함수로 id, pw가 유효한지 검출
// 여기서 로그인에 성공하면 위의 passport.serializeUser 함수로 이동

passport.use(
    new LocalStrategy(
        {
            usernameField: "id",
            passwordField: "pwd",
        },
        function (userid, password, done) {
            console.log('--------------------------' + userid);
            console.log('--------------------------' + password);

            conn = db_connect.getConnection();
            conn.query(db_sql.cust_select_one, [userid], (err, row, fields) => {

                if (err) throw err;

                let result = 0;
                console.log('--------------------------' + row[0]['pwd']);

                let name = row[0]['name'];
                let acc = row[0]['acc'];

                if (row[0] == undefined) {
                    return done(null, false, { message: "Login Fail " });
                } else if (row[0]['pwd'] != password) {
                    return done(null, false, { message: "Login Fail " });
                } else {
                    return done(null, { id: userid, name: name, acc: acc });
                }

            });

        }
    )
);

// login 요청이 들어왔을 때 성공시 / 로, 실패시 /login 으로 리다이렉트
app.post(
    "/login",
    passport.authenticate("local", {

        successRedirect: "/",  // 로그인 성공 시 리다이렉트 경로
        failureRedirect: "/loginerror",  // 로그인 실패 시 리다이렉트 경로
    })
);


app.get('/loginerror', (req, res) => {
    res.render('index', { center: 'loginerror' });
})

app.get('/logout', (req, res) => {
    req.session.destroy();          //세선 사용자 정보를 날려라
    res.redirect('/');
})

// function go(req, res, obj) {         //로그인 여부를 체크하는 함수

// }

app.get('/', (req, res) => {
    goto.go(req, res, undefined);      //undefined = 센터에 아무것도 없다
})



//login 요청시 get
app.get('/login', (req, res) => {
    goto.go(req, res, { 'center': 'login' });
})

//회원가입 요청시 get
app.get('/register', (req, res) => {
    goto.go(req, res, { 'center': 'register' });
})

app.post('/registerimpl', (req, res) => {
    let id = req.body.id;        //post 방식일때는 body에서 가져옴
    let pwd = req.body.pwd;
    let name = req.body.name;
    let acc = req.body.acc;
    let values = [id, pwd, name, acc];

    conn = db_connect.getConnection();

    conn.query(db_sql.cust_insert, values, (e, result, fields) => {
        try {
            if (e) {
                console.log('Insert Error');
                throw e;
            } else {
                console.log('Insert OK !');
                console.log(id + ' ' + pwd + ' ' + name + ' ' + acc);
                go(req, res, { 'center': 'registerpass', 'name': name });
                // res.redirect('/registerpass');           
                // res.render('index', {'center': 'registerpass', 'name': name });
                // 바로 이렇게 작성해도 됨  
            }
        } catch {
            console.log(e)
        } finally {
            db_connect.close(conn)
        }
    })
})

// app.get('/registerpass', (req, res) => {
//     let name = req.query.name;
//     res.render('index', { 'center': 'registerpass', 'name' : name });
// })

//로그아웃 옆 아이디를 눌렀을때
app.get('/myinfo', (req, res) => {
    let id = req.query.id;

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
                res.redirect('/myinfo?id='+id);            //기존에 서버에 만들어뒀던걸 리다이렉트
            }
        }catch {
            console.log(e);
        }finally {
            db_connect.close(conn);
        }
    })
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
                res.redirect('/');
                console.log(id);
            }
        } catch (err) {
            console.log(err);
        } finally {
            db_connect.close(conn);
        }
    })
})


app.get('/map', (req, res) => {
    goto.go(req, res, { 'center': 'map' });
})

app.get('/map2', (req, res) => {
    goto.go(req, res, { 'center': 'map2' });
})

app.get('/detail', (req, res) => {
    goto.go(req, res, { 'center': 'detail' });
})

app.get('/chart', (req, res) => {
    goto.go(req, res, { 'center': 'chart' })
})

app.get('/chart2', (req, res) => {
    goto.go(req, res, { 'center': 'chart2' });
})

// app.get('/cust', (req,res)=> {
//     res.render('index', {'center' : 'cust'})
// })

// app.get('/item', (req,res)=> {
//     res.render('index', {'center' : 'item'})
// })

// 4. 화면 별 Router 등록
// Router 선언
const cust = require('./routes/cust');
app.use('/cust', cust);

const item = require('./routes/item');
app.use('/item', item);

const block = require('./routes/block');
app.use('/block', block);

//포트설정
app.listen(port, () => {                       // 서버를 실행하고
    console.log(`server start port:${port}`)    // server start port : 포트번호 라는 메시지를 확인할수있게 띄워줌
})
