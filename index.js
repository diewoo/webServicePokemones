var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser=require('body-parser');
var app = express();
//app.use(bodyParser.urlencoded({extended : true}));
//parseo como json
app.use(bodyParser.json())
const mongoose=require('mongoose'),
	Schema = mongoose.Schema,
        ObjectId =  Schema.ObjectId;

const uri ="mongodb://diego:12345@ds053196.mlab.com:53196/ulima-moviles";

//esquema de usuario
var schemaUsuario = new Schema({
    id : ObjectId,
    username : String,
    password : String
});

var rptalogin=function( user,mensaje,codigo ){
	return  {
	  status:{
	    	msg:mensaje,
	    	cod:codigo
	  },
	  usuario:{
	    	username:user,
	    	password:null
	  }
	}

};
var rptaregistro=function(mensaje,codigo ){
	return  {
	  status:{
	    	msg:mensaje,
	    	cod:codigo
	  }
	}

};

var Usuario = mongoose.model('users',schemaUsuario);
	app.set('port', (process.env.PORT || 5002));

//post de usuarios
app.post('/registro', function( req , res ) {

	if(!mongoose.connection.readyState){
        mongoose.connect(uri);
    }
    var db =  mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function callback () {
				console.log(req.body);
				Usuario.findOne({username:req.body.username,password:req.body.password},(err,dato)=>{
						var rpta={}
						if(dato){
							rpta=rptaregistro("Registro exitoso!",1)
						}else{
							rpta=rptaregistro("Registro Incorrecto!",0)

						}
						mongoose.disconnect();
						res.send(rpta);

    });

//console.log(req.body);
//res.send(req.body);

});
//response login
app.post('/login', function(req,res) {
	if(!mongoose.connection.readyState){
				mongoose.connect(uri);
		}
		var db =  mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function callback () {
				Usuario.findOne({username:req.body.username,password:req.body.password},(err,dato)=>{
						var rpta={}
						if(dato){
							rpta=rptalogin(req.body.username,"Login exitoso!",1)
						}else{
							rpta=rptalogin(req.body.username,"Datos Incorrectos!",0)

						}
						mongoose.disconnect();
						res.send(rpta);


				});

		});
	//	res.send(rptalogin(req.body.username,"Registro exitoso!",1));

});

app.get('/', function(req,res) {

  if(!mongoose.connection.readyState){
        mongoose.connect(uri);
    }
    var db =  mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
        Usuario.find({},(err,dato)=>{
			console.log(dato);
			res.send(dato);
            mongoose.disconnect();

        });
    });
});



app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
