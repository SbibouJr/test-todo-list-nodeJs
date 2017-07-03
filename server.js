
"use strict"
let fs = require("fs");
let express = require("express");
let ejs = require("ejs");
let session = require('cookie-session'); // Charge le middleware de sessions
let bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
let urlencodedParser = bodyParser.urlencoded({ extended: false });

let app = express();

app.use( urlencodedParser )

.use(session({secret: "secretTodoList"}))

.get("/style", function(req, res){

	fs.readFile("./style/style.less", function (err,data){
		if(err){
			console.log("ERROR : " + err.message);
			res.setHeader('Content-Type', 'text/html ');
			res.status(404).send("ERREUR 404 : Page introuvable");
		}
		else{
			res.setHeader('Content-Type', 'text/css');
			res.end(data);
		}

	});
})

.get("/", function(req, res){
	
	req.session.todoList = req.session.todoList ? req.session.todoList : [];

	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": req.session.todoList});
})

.get("/:postId", function(req, res){
	
	let s_todoList = req.session.todoList ? req.session.todoList : [];
	let post_id = req.params.postId;

	if(s_todoList){
		if(post_id >= 0 && post_id < s_todoList.length){
			let newTodoList = [];
			let j = 0;
			for(let i = 0; i < s_todoList.length; i++){
				if(i != post_id){
					newTodoList[j] = s_todoList[i];
					j++;
				}
			}
			s_todoList = newTodoList;
		}
	}

	req.session.todoList = s_todoList;

	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": s_todoList});
})

.post("/", function(req, res){

	let s_todoList = req.session.todoList ? req.session.todoList : [];

	if(req.body.todo){
		s_todoList[s_todoList.length] = req.body.todo;
	}

	req.session.todoList = s_todoList;

	res.setHeader('Content-Type', 'text/html');
	res.render("todo.ejs", {"todoList": s_todoList});
})

.use(function(req, res, next){
	res.setHeader('Content-Type', 'text/html');
	res.status(404).send("ERREUR 404 : Page introuvable");
});

app.listen("8080");