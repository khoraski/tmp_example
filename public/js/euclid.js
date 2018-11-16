//This is supposed to return the data stored in
//	a session cookie, but it has not been implemented,
//	so currently it just returns "bob".
function euclid_session() {
	return "bob";
}

//Parse a response query from the URL bar.
function euclid_response(field) {
	//-field tag is optional.
	field = field.replace("-field", "");
	var getRequest = window.location.href.split("?")[1];
	return unescape(getRequest.split(field + "=")[1].split("&")[0]);
}

//Check if a response query available.
function euclid_has_response() {
	var fields = ["name=", "data=", "action=", "status="];
	for (var i = 0; i < fields.length; i++)
		if (window.location.href.replace(fields[i], "") == window.location.href)
			return false;
	return true;
}

//euclid_form class
function euclid_form(id) {
	//Create a hidden text box named "name".
 	var createHiddenField = function(name) {
  	var field = document.createElement("input");
  	field.setAttribute("name", name);
		field.setAttribute("type", "text");
  	field.setAttribute("style", "display:none");
  	field.setAttribute("class", name + "-field");
	  return field;
 	}

	//Check if a parent object contains a child
 	//  field named "child_name".
 	var hasChild = function(parent, child_name) {
  	var child = parent.getElementsByTagName("input");
		for (var i = 0; i < child.length; i++) {
			if (child[i].getAttribute("name") == child_name) {
				child[i].setAttribute("class", child_name + "-field");
				return true;
			}
		}
		return false;
	}

	//Get the form object.
	var formObj = document.getElementById(id);

	//Set attributes.
  formObj.setAttribute("action", "/");
  formObj.setAttribute("method", "post");

  //Create possible missing fields.
  if (!hasChild(formObj, "action"))
    formObj.appendChild(createHiddenField("action"));
  if (!hasChild(formObj, "name"))
    formObj.appendChild(createHiddenField("name"));
  if (!hasChild(formObj, "data"))
    formObj.appendChild(createHiddenField("data"));

	//Function for setting fields.
	formObj.setField = function(name, value) {
		//The "-field" tag is optional.
		name = name.replace("-field", "");
		this.getElementsByClassName(name + "-field")[0].value = escape(value);
	}

	//This function is called right before a form is submitted.
	formObj.onquery = function() {}
	formObj.onsubmit = function() {
		//Convert the URL into a hex string.
		var loc = window.location.href.split("?")[0];
		var loc16 = "";
		for (var i = 0; i < loc.length; i++) {
			var b = loc.charCodeAt(i).toString(16);
			while (b.length < 2) b = "0" + b;
			loc16 += b;
		}
		//Save it as a cookie.
		document.cookie = "redirect=" + loc16;
		//Handle user-defined query.
		this.onquery();
	}

	return formObj;
}
