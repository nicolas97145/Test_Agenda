
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var session = require('express-session');
var app = express();
var mysql = require('mysql');
var bodyParser=require("body-parser");

//Connexion à la base de données
var connection = mysql.createConnection({
              host     : 'localhost',
              user     : 'root',
              password : '',
              database : 'extraterrestre'
            });
 
//Affichage si réussite
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connecté à la base de données!");
});
 
global.db = connection;
 
// environnements
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 60000 }
            }))
 
// Routes pour l'appel des get et post
 
app.get('/', routes.index);//Appel de la page index 
app.get('/signup', user.signup);//Appel de la page d'inscription
app.post('/signup', user.signup);//Envoi des infos de la page d'inscription
app.get('/login', routes.index);//Appel de la page login
app.post('/login', user.login);//Envoi des infos de la page de connexion
app.get('/home/accueil', user.accueil);//Appel de la page d'accueil après connexion
app.get('/home/amis', user.amis); //Appel de la page amis
app.get('/home/ajout', user.ajout); //Appel de la page ajout
app.get('/home/logout', user.logout); //Appel de la fonction déconnexion
app.post('/modification', user.modification);//Envoi des infos de la page de modification
app.post('/ajouter', user.ajouter);//Envoi des infos de la fonction ajouter
app.get('/supprimer', user.supprimer);//Envoi des infos de la fonction supprimer

app.listen(8080)
