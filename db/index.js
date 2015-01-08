var mongoose = require('mongoose');
var clc = require('cli-color');
mongoose.connect('mongodb://127.0.0.1:27017/game-d', function(err, db){
    if(err){
        console.log(err);
        process.exit(1);
    }
    console.log(clc.green('数据库连接成功！'));
    dbReady.emit('dbReady');
});

mongoose.connection.on("connected", function() {
    console.log("Mongoose default connection connected");
});   

mongoose.connection.on("error", function(err) {
    console.log({
      err: err
    }, "Mongoose default connection error");
    process.exit(1);
});

mongoose.connection.on("disconnected", function() {
    console.log("Mongoose default connection disconnected");
    process.exit(1);
});

require('./user');

module.exports = {
    user: mongoose.model("User")
};