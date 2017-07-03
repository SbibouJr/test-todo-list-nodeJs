// ************************************************
// ****************** NODE JS *********************
// ************************************************

// Chargement des module node
"use strict"
let express = require("express");
let ejs = require("ejs");
let session = require('cookie-session'); // Charge le middleware de sessions
let bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
let urlencodedParser = bodyParser.urlencoded({ extended: false });

let app = express();


app.use(urlencodedParser)
.use(session({secret: "Shh, its a secret!"}));

app.get("/", function(req, res){
	
	if(!req.session.todoList){
		req.session.todoList = [];
	}

	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": req.session.todoList});
})
app.get("/:rmId", function(req, res){
	let todoList = [];
	if(req.session.todoList){
		if(req.params.rmId >= 0 && req.params.rmId < req.session.todoList.length){
			var j = 0;
			for(var i = 0; i < req.session.todoList.length; i++){
				if(i != req.params.rmId){
					todoList[j] = req.session.todoList[i];
					j++;
				}
			}
			req.session.todoList = todoList;
		}
	}
	else{
		req.session.todoList = [];
	}

	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": req.session.todoList});
})
.post("/", function(req, res){
	if(req.body.todo){
		if(req.session.todoList){
			req.session.todoList[req.session.todoList.length] = req.body.todo;
		}
		else{
			req.session.todoList = [];
		}
	}
	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": req.session.todoList});
})
.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/html');
	res.status(404).send("ERREUR 404 : Page introuvable");
});

app.listen("8080");