var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser=require('body-parser');
var app = express();
var request = require('ajax-request');
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
    password : String,
		pokemones:{type:Array, id: [] }
});
var rptaPokemones=function( pokes,mensaje,codigo ){
	return  {
	  status:{
	    	msg:mensaje,
	    	cod:codigo
	  },
	  	pokemones:pokes


	  }


};


//rppta de login
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
//obtener el nivel x
var rptaPokemon=function(idPoke,nombrePoke,imagen,tipo,desc){
	return{
		id:idPoke,
		name:nombrePoke,
		type:tipo,
		nivel:Math.floor((Math.random() * 100) + 1),
		img:imagen,
		description:desc
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


//libreria ajax request
/* app.get('/data',function(req,res){
	 request.post({
		 url: 'http://ulima-parcial.herokuapp.com/login',
		 data: {
			 username:"proxys",
			 password:"123"
		 },
		 headers: {}
	 },function(err,ress,body){
		 console.log(body);
		 res.send(body);
	 });
});**/
//obtener pokemones
function obtenerPokemones(callback){
	var ran = Math.floor((Math.random() * 30) + 1);

	request({
		url: 'https://pokeapi.co/api/v2/pokemon/' + ran +'/' ,

		method: 'GET',
		data: {
			query1: 'image'
		}
	}, function(err, ress, body) {
		console.log("ran = " + ran);
		var cuerpo = JSON.parse(body);
		var name=cuerpo.forms[0].name;
		var img=cuerpo.sprites.front_default;
		var tipo=cuerpo.types[0].type.name;
		 obtenerDescripcion(ran,function(data){
			 //console.log(rptaPokemon(ran,name,img,tipo,data));
			 callback(rptaPokemon(ran,name,img,tipo,data));
		});

	 });
};

var calcularNumerPokes = () => {
	var numPokes = Math.floor((Math.random() * 6) + 1);
	var ids = [];
	var ranPoke;
	var ok = false;
	//console.log("El numero al alzar es : " + numPokes);

	for (var i = 0; i < numPokes; i++) {
		//console.log("valor de i : "+i);
		ok = false;
		while (!ok) {
			var ran = Math.floor((Math.random() * 150) + 1);
			//console.log("Random :" +  ran);
			if (!isInclude(ids, ran)) {
				ok = true;
				ranPoke = ran;
				ids.push(ran);
				//console.log("Se agrego el numero : " + ran);
			}
		}
	}
	//console.log(ids.length);
	return ids;
}

var isInclude = (array, val) => {
	var include = false;
	var i = 0;
	while (!include && i < array.length) {
		i++;
		if (array[i] == val) {
			include = true;
		}
	}
	return include;
}


var getPromise = (id) => {
	return new Promise(function (resolve, reject) {
		request({
			url: 'https://pokeapi.co/api/v2/pokemon/' + id + '/',

			method: 'GET',
			data: {
				query1: 'image'
			}
		}, function (err, ress, body) {
			var cuerpo = JSON.parse(body);
			var name = cuerpo.forms[0].name;
			var img = cuerpo.sprites.front_default;
			var tipo = cuerpo.types[0].type.name;
			if (id <= 30) {
				obtenerDescripcion(id, function (data) {
					resolve(rptaPokemon(id, name, img, tipo, data));
				});
			} else {
				resolve(rptaPokemon(id, name, img, tipo, "No se tiene  descripcion disponible para este pokemon! "));
			}
		});
	});
}


//traemos la descripciones del pokemon
function obtenerDescripcion(id,correcto){
	request({
			url: 'https://pokeapi.co/api/v2/characteristic/' + id +'/' ,

			method: 'GET',
			data: {
				query1: 'image'
			}
		}, function(err, ress, body) {
		 var cuerpo=JSON.parse(body);
		 var descripcion=cuerpo.descriptions;
		 var desc='';
			descripcion.map(function(element){
					if(desc!=='undefined'){

						if(desc=== ''){
							desc=element.description;
						}else{
								desc= desc + ' , '+element.description ;
						}
					}

			});
		 	correcto(desc);
		});

}
/*
 app.get('/atrapar',function(req,res){
	 var pokemones=[];
	 var numero=Math.floor((Math.random() * 10) + 1);
	 console.log("numero " + numero);
	 ///for(var i=1;i<=numero;i++){
		 //console.log(i);
		 obtenerPokemones(function(data){
			 console.log(data);
			 pokemones.push({name:"jaja"});
			 res.send(pokemones)
		 });

	//};
});*/
//metodo para atrapar
app.get('/usuario/:username/pokemones',function(req,res){
	if(!mongoose.connection.readyState){
				mongoose.connect(uri);
		}
		var db =  mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function callback () {
				Usuario.findOne({username:req.params.username},"pokemones",(err,dato)=>{
						var rpta={}
						if(dato){
							rpta=rptaPokemones(dato,"Mis Pokemones Atrapados!",1)
						}else{
							rpta=rptaPokemones(dato,"Casi papu!",0)

						}
						mongoose.disconnect();
						res.send(rpta);


				});

		});
});
app.post('/addpoke', function(req,res){
	if(!mongoose.connection.readyState){
				mongoose.connect(uri);
		}
		var db =  mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', function callback () {
				var rpta={}
				Usuario.findOneAndUpdate({username:req.body.username}, { $push : {'pokemones': req.body.id} },
						function (err, doc) {
    					if (err) {
        			console.log(err);
    				} else {
							console.log(rptaregistro("Pokemon Atrapado!",1));
      			res.send(rptaregistro("Pokemon Atrapado!",1));
    		}
});
		});
});
app.get('/pokedata/pokemones', (req, res) => {
	var pokemones = { pokemones: [] };
	var promises = [];
	var pokesID = calcularNumerPokes();
	var numPokes = pokesID.length;

	for (var i = 0; i < numPokes; i++) {
		promises.push(getPromise(pokesID[i]));
	}



	Promise.all(promises)
		.then(function (ress) {
			console.log("Todas las promesas realizadas");
			console.log(promises.length);
			ress.forEach(function (item) {
				pokemones.pokemones.push(item);
			})
			console.log(ress.length);
			res.send(pokemones);
		}, function (err) {
			console.log(err);
			res.send("Casi lo intento");
		});


});


//metodo para traer pokemones
app.get('/pokedata/:id',function(req,res){
	request({
		url: 'https://pokeapi.co/api/v2/pokemon/' + req.params.id +'/' ,

		method: 'GET',
		data: {
			query1: 'image'
		}
	}, function(err, ress, body) {
	//	console.log('https://pokeapi.co/api/v2/pokemon/' + req.params.id);
		var cuerpo = JSON.parse(body);
		var name=cuerpo.forms[0].name;
		var img=cuerpo.sprites.front_default;
		var tipo=cuerpo.types[0].type.name;
		if(req.params.id<=30){
			obtenerDescripcion(req.params.id,function(data){
				res.send(rptaPokemon(req.params.id,name,img,tipo,data));
 			});
		}else{
			res.send(rptaPokemon(req.params.id,name,img,tipo,"No se encuentra desccripcion"));
		}

	});
});
//model de usuario
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
				var rpta={}
        var usuario = new Usuario(req.body);
        usuario.save((err)=>{
            rpta=rptaregistro("Registro realizado!",1);

            mongoose.disconnect();
						res.send(rpta);
        });
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
