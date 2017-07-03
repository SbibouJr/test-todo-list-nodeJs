
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

.use( (p_req, p_res, p_next ) => {
	p_req.session.todoList = p_req.session.todoList ? p_req.session.todoList : [];
	p_next();
})

.get("/style", (p_req, p_res) => {

	fs.readFile("./style/style.less", function (err,data){
		if(err){
			console.log("ERROR : " + err.message);
			p_res.setHeader('Content-Type', 'text/html ');
			p_res.status(404).send("ERREUR 404 : Page introuvable");
		}
		else{
			p_res.setHeader('Content-Type', 'text/css');
			p_res.end(data);
		}
	});
})

.get("/home", (p_req, p_res) => {
	p_res.setHeader('Content-Type', 'text/html');
	p_res.render("todo.ejs", {"todoList": p_req.session.todoList});
})

.get("/home/remove/:post_id", (p_req, p_res) => {
	
	let s_todoList = p_req.session.todoList;
	let post_id = p_req.params.post_id;

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

	p_req.session.todoList = s_todoList;
	p_res.redirect("/home");
})

.post("/home/add", (p_req, p_res) => {

	let s_todoList = p_req.session.todoList;

	if(p_req.body.todo){
		s_todoList[s_todoList.length] = p_req.body.todo;
	}

	p_req.session.todoList = s_todoList;
	p_res.redirect("/home");
})

.use( (p_req, p_res, p_next) => {
	p_res.redirect("/home");
});

app.listen("8080");