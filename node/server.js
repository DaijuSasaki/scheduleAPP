const express = require('express')
const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'todosql',
    database: 'todo'
})

const app = express()
const portNo = 51001
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.listen(portNo, () => {
    console.log('起動', `http://localhost:${portNo}`);
})

app.get('/api/get', (req, res) => {
    const dates = req.query.dates
    const memberIds = req.query.ids
    let sql
    if(dates === undefined && memberIds !== undefined) {
	sql = mysql.format(`SELECT date,CONCAT(id) id,content FROM schedule WHERE id IN(?) ORDER BY date;`,[memberIds])
    }
    else if(dates !== undefined && memberIds === undefined) {
	sql = mysql.format(`SELECT date,CONCAT(id) id,content FROM schedule WHERE date IN (?) ORDER BY date;`,[dates])
    }
    else if(dates === undefined && memberIds === undefined) {
	sql = mysql.format(`SELECT date,CONCAT(id) id,content FROM schedule ORDER BY date;`)
    }
    else {
	sql = mysql.format(`SELECT date,CONCAT(id) id,content FROM schedule WHERE date IN (?) AND id IN(?) ORDER BY date;`,[dates,memberIds])
    }
    console.log(sql)
    db.query(sql, (err, result, fields) => {
	if(err) {
	    console.log(err)
	    res.json({status: false, msg: err})
	    db.end()
	    return
	}
	console.log(result)
	res.json({status: true, data: result})
    })
})

app.post('/app/del', (req, res) => {
    const date = req.body.date
    const memberId = req.body.id
    const testSql = mysql.format('SELECT * FROM schedule WHERE date=? AND id=?;', [date, memberId])
    const sql = mysql.format('DELETE FROM schedule WHERE date=? AND id=?;', [date, memberId])
    console.log(testSql)
    db.query(testSql, (err, result1) => {
	if(err) {
	    console.log(err)
	    res.json({status: false, msg: err})
	    return
	}
	if(result1.length === 0) {
	    console.log("存在しない")
	    res.json({status: false, msg: "存在しない"})
	    return
	}
	console.log(sql)
	db.query(sql, (err, result2) => {
	    if(err) {
		console.log(err)
		res.json({status: false, msg: err})
		return
	    }
	    console.log(result2)
	})
    })
})

app.post('/app/put', (req, res) => {
    const date = req.body.date
    const memberId = req.body.id
    let content = req.body.content.replace(/_/g,'');
    if(date === undefined || memberId === undefined || content === undefined) {
	res.json({status: false, msg: '値が足りない'})
	return
    }
    const testSql = mysql.format('SELECT * FROM schedule WHERE date=? AND id=?;', [date, memberId])
    let sql;
    console.log(testSql)
    db.query(testSql, (err, result1) => {
	if(err) {
	    console.log(err)
	    res.json({status: false, msg: err})
	    return
	}
	if(result1.length !== 0) {
	    content = '_' + content
	    sql = mysql.format('UPDATE schedule SET content = CONCAT(IFNULL(content, ""), IFNULL(?, "")) WHERE date=? AND id=?;', [content, date, memberId])
	}
	else {
	    sql =  mysql.format('INSERT INTO schedule values(?, ?, ?);', [date, memberId, content])
	}
	console.log(sql)
	db.query(sql, (err, result2) => {
	    if(err) {
		console.log(err)
		res.json({status: false, msg: err})
		return
	    }
	    console.log(result2)
	})
    })
})

app.use('/', express.static('./public'))
