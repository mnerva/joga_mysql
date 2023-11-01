// application packages
const express = require('express')
const app = express()

const path = require('path')
// add template engine
const hbs = require('express-handlebars');
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/'
}))
// setup static public directory
app.use(express.static('public'));

const mysql = require('mysql')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// create database connection
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "qwerty",
	database: "joga_mysql"
})

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected to joga_mysql db")
})

// show author's articles
app.get('/author/:author_id', (req, res) => {
	let query = `SELECT * FROM article WHERE author_id="${req.params.author_id}"`
	let articles
	con.query(query, (err, result) => {
		if (err) throw err;
		articles = result
		console.log(articles)
		query = `SELECT * FROM author WHERE id="${req.params.author_id}"`
		let author
		con.query(query, (err, result) => {
			if (err) throw err;
			author = result
			console.log(author)
			res.render('author', {
				author: author,
				articles: articles
			})
		})
	})
})


// show all articles - index page
app.get('/', (req, res) => {
	let query = "SELECT * FROM article";
	let articles = []
	con.query(query, (err, result) => {
		if (err) throw err;
		articles = result
		res.render('index', {
			articles: articles
		})
	})
})

// show article by this slug
app.get('/article/:slug', (req, res) => {
	let query = `select *, article.name as article_name, author.name as author_name from article join author on article.author_id=author.id where slug="${req.params.slug}"`
	let article;
	con.query(query, (err, result) => {
		if (err) throw err;
		article = result
		console.log(article)
		res.render('article', {
			article: article
		})
	});
});

// app start point
app.listen(3005, () => {
	console.log('App is started at http://localhost:3005');
})