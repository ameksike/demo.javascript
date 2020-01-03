
/*
 * @author		Antonio Membrides Espinosa
 * @email    	tonykssa@gmail.com
 * @date		26/12/2019
 * @copyright  	Copyright (c) 2019-2029
 * @license    	GPL
 * @version    	1.0
 * */

var express = require("express");
var app = express();

//... Set response config
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//... Set global server config
var HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

//... Build Default Controller
var DefaultController = require("./controller.js").Default;
var controller = new DefaultController();

//... Router .......................................................................
app.get("/phonebook", (req, res, next) => {  
    console.log("... on Select All ...");
    controller.onSelectAll(req, res, next);
});

app.get("/phonebook/:id", (req, res, next) => {
    console.log("... on Select ...");
    controller.onSelect(req, res, next);
});

app.post("/phonebook/", (req, res, next) => {
    console.log("... on Insert ...");
    controller.onInsert(req, res, next);
})

app.patch("/phonebook/:id", (req, res, next) => {
    console.log("... on Update ...");
    controller.onUpdate(req, res, next);
})

app.put("/phonebook/:id", (req, res, next) => {
    console.log("... on Update ...");
    controller.onUpdate(req, res, next);
})

app.delete("/phonebook/:id", (req, res, next) => {
    console.log("... on Delete ...");
    controller.onDelete(req, res, next);
})

app.get("/", (req, res, next) => {
    console.log("... on Home ...");
    res.json({"message":"REST API for PhoneBook it is Ok."});
});

/*
app.use(function(req, res){ 
    console.log("... on 404 (Default response for any other request) ...");
    console.log(req.headers);
    res.status(404); 
});*/

