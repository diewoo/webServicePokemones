var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

const mongoose=require('mongoose'),
	Schema = mongoose.Schema,
        ObjectId =  Schema.ObjectId;
		mongoose.Promise = global.Promise;
const uri ="mongodb://diego:12345@ds053196.mlab.com:53196/ulima-moviles";


var schemaUsuario = new Schema({
    id : ObjectId,
    user : { type: String , required: true},
    pass : { type: String , required: true},
}, { strict: false });

var Usuario = mongoose.model('usuario',schemaUsuario);
/*
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});*/

app.set('port', (process.env.PORT || 5002));

app.get('/d', function(request, response) {	
  
  if(!mongoose.connection.readyState){
        mongoose.connect(uri);
    }
    var db =  mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    console.log("correcto!");
    db.once('open', function callback () {
        Usuario.findOne({},(err,dato)=>{
		
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
app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});