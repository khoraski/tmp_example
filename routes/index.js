var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'pi',
  password : 'euclid490',
  database : 'm3'
});
connection.connect();

//body('name').isLength({ min: 1 }).withMessage('Name empty')
//	.isAlpha().withMessage('Name must be alphabet letters.');
//sanitizeBody('name').trim().escape();

//This is called after a save operation finishes.
function return_after_save(err, res) {
	//connection.end();
		if (!err) {
    	res.send("<script>window.location.href='/demo?status=success&action=save';</script>");
    } else {
    	res.send("<script>window.location.href='/demo?status=failure&action=save';</script>");
    }
}
//This is called after a load operation finishes.
function return_after_load(err, data, res) {
	//connection.end();
  if (!err) {
  	res.send("<script>window.location.href='/demo?status=" + data + "&action=load';</script>");
  } else {
  	res.send("<script>window.location.href='/demo?status=failure&action=load';</script>");
  }
}

router.post('/demo', function(req, res) {
	var name = req.body['name'];
	var data = req.body['data'];
	//Check if the name is valid.
	if (/^[a-z]+$/i.test(name) == false || name.length == 0) {
		//If it is invalid, return with an error.
		if (data == "LOAD") return_after_load(true, undefined, res);
		else return_after_save(true, res);
		return;
	//Save our data.
	} else if (data != "LOAD") {
		var circles = JSON.parse(data.split("|")[0]);
		var squares = JSON.parse(data.split("|")[1]);
		var query_count = 0;
		var query_error = false;

		//If we're saving nothing, we can do nothing.
		if (circles.length + squares.length == 0) {
			return_after_save(false, res);
			return;
		}

		//Save our circles.
		for (var i = 0; i < circles.length; i++) {
	 		connection.query("INSERT INTO Shapes VALUES ('" + name + "', " + circles[i]['x'] + ", " + circles[i]['y'] + ", 'circle')", (err, rows, fields) => {
				if (err) query_error = true;
				query_count++;
				if (query_count == circles.length + squares.length) {
					query_count++;
					return_after_save(query_error, res);
				}
			});
		}

		//Save our squares.
    for (var i = 0; i < squares.length; i++) {
      connection.query("INSERT INTO Shapes VALUES ('" + name + "', " + squares[i]['x'] + ", " + squares[i]['y'] + ", 'square')", (err, rows, fields) => {
        if (err) query_error = true;
        query_count++;
        if (query_count == circles.length + squares.length) {
          query_count++;
          return_after_save(query_error, res);
        }
      });
    }
	} else {
		var circles, squares;
		var query_error = false;
		connection.query("SELECT * FROM Shapes WHERE shape='circle' AND name='" + name + "';", (err, rows, fields) => {
			if (err) query_error = true;
			var cr = rows == undefined ? new Array(0) : rows;
			connection.query("SELECT * FROM Shapes WHERE shape='square' AND name='" + name + "';", (err, rows, fields) => {
				if (err) query_error = true;
				var sr = rows == undefined ? new Array(0) : rows;

				//Throw an error if we loaded nothing.
				if (cr.length == 0 && sr.length == 0) query_error = true;

				//Parse what we loaded.
				var circles = new Array(0);
				var squares = new Array(0);
				for (var i = 0; i < cr.length; i++) {
					var x = cr[i]['x'];
					var y = cr[i]['y'];
					circles.push({ x, y });
				}
        for (var i = 0; i < sr.length; i++) {
					var x = sr[i]['x'];
					var y = sr[i]['y'];
					squares.push({ x, y });
        }
				var data = JSON.stringify(circles) + "|" + JSON.stringify(squares);
				return_after_load(query_error, data, res);
			});
		});
	}
});

//connection.connect();

/*connection.query('SELECT * FROM Book', function(err, rows, fields) {
  if (err) throw err;
  console.log(rows);
  console.log(fields);
});*/

//connection.end();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/demo', function(req, res, next) {
  fs.readFile('pages/demo.html', 'utf8', function(err, data) {
    if (err) throw err;
    res.send(data);
  });
});


module.exports = router;
