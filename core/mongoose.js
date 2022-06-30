var mongoose = require("mongoose"),
    fs = require("fs"),
    models_path = process.cwd() + '/model';

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/nodejsworkshop");

var db = mongoose.connection;

db.on('error', function(err) {
    console.error("Mongo connection error: ", err);
});

db.on('open', function callback() {
    console.info("Mongo connection established");
});

fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) {
        require(models_path + '/' + file);
    }
});
