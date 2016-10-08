var cool = require('cool-ascii-faces');
var express = require('express');
var bodyParser=require('body-parser');
var app = express();
//app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

const mongoose=require('mongoose'),
	Schema = mongoose.Schema,
        ObjectId =  Schema.ObjectId;

const uri ="mongodb://diego:12345@ds053196.mlab.com:53196/ulima-moviles";


var schemaUsuario = new Schema({
    id : ObjectId,
    user : String,
    pass : String
});

var Usuario = mongoose.model('usuarios',schemaUsuario);
app.set('port', (process.env.PORT || 5002));

app.post('/insert', function( req , res ) {

	/*if(!mongoose.connection.readyState){
        mongoose.connect(uri);
    }
    var db =  mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function callback () {
				console.log(req.body);
        var usuario = new Usuario({user:"proxylocos",pass:"proxy"});
        usuario.save((err)=>{
            if(err) throw err
            console.log("Guardado con exito!");
            mongoose.disconnect();
						res.send("ok");
        });
    });*/

console.log(req.body);
res.send(req.body);

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
