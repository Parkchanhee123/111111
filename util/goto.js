module.exports = {
    go: function (req, res, obj) {
        let loginid, loginname;
        if (req.user) {
            loginid = req.user.id;
            loginname = req.user.name;
        }
        if (loginid != undefined) {   //로그인이 된상태
            if (obj != undefined) {
                obj.loginid = loginid;
                //{, 'loginid' : loginid}  오브젝트(변수(name이나)나 center 같은 화면정보)
                res.render('index', obj);
            } else {
                res.render('index', { 'loginid': loginid });
            }
        } else {                           //로그인이 안된상태
            if (obj != undefined) {
                res.render('index', obj);
            } else {
                res.render('index');
            }
        }
    }// end go func
}