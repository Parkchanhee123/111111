const express = require('express');
const app = express();
const router = express.Router();
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser')

//유틸리티
var goto = require('../util/goto.js');

// Database 연동
var db_connect = require('../db/db_connect.js');
var db_sql = require('../db/db_sql.js');

router
    .get("/block1", (req, res) => {      
        goto.go(req, res, { 'center': 'block/block1' });
    })

    .get("/block2", (req, res) => {      
        goto.go(req, res, { 'center': 'block/block2' });
    })


module.exports = router;