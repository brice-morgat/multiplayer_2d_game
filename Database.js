var mongojs = require("mongojs");
var db = mongojs('localhost:27017/myGame',  ['account', 'progress']);

Database = {};

Database.isValidPassword = function(data,cb){
    db.account.find({username:data.username, password:data.password} ,function(err,res) {
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

Database.isUsernameTaken = function(data,cb){
    db.account.find({username:data.username} ,function(err,res) {
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}

Database.addUsername = function(data,cb){
    db.account.insert({username:data.username, password:data.password} ,function(err) {
        cb();
    });
}