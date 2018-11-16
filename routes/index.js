var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var fs = require('fs');
var mysql = require('mysql');
var sql_global = require('../../sql_global');
var connection = sql_global.connect(mysql);

//Returns data to the client-side.
function responseQuery(res, name, data, action, status) {
	name = escape(name);
	data = escape(data);
	action = escape(action);
	status = escape(status);
  fs.readFile('redirect', 'utf8', function(err, fileData) {
    var getRequest = "?name="+name+"&data="+data+"&action="+action+"&status="+status;
    fileData = fileData.replace("<GET_REQUEST>", getRequest);
    if (err) throw err;
    res.send(fileData);
  });
}

//Handles a loading action (loads a project).
function loadingAction(res, name, data) {
	//Sanitize inputs.
	if (/^[a-z]+$/i.test(name) == false) {
		responseQuery(res, name, "Invalid file name.", "load", "failure");
		return;
	}
	//Look for the id of a project with the given name.
	connection.query("SELECT id FROM PROJECTS WHERE name='" + name + "';", (err, rows, fields) => {
		//If no projects were found, then the name was invalid.
		if (rows.length == 0) {
			responseQuery(res, name, "Could not find project.", "load", "failure");
			return;
		}
		//Load all data associated with the project id.
		var projectID = rows[0]["id"];
		connection.query("SELECT * FROM PROJECT_DATA WHERE id=" + projectID + ";", (err, rows, fields) => {
			var projectText = "";
			for (var i = 0; i < rows.length; i++) {
				projectText += rows[i]["data"] + "\n";
			}
			responseQuery(res, name, projectText, "load", "success");
		});
	});
}

//Handles client-side requests to the server.
router.post('/', function(req, res) {
	var action = unescape(req.body['action']);
	var name = unescape(req.body['name']);
	var data = unescape(req.body['data']);

	if (action == "load") {
		loadingAction(res, name, data);
	}
});

module.exports = router;
