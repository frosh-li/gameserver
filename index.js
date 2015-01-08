var Server = require('./socketServer/server.js'),
    MongoClient = require('mongodb').MongoClient,
    ProtoBuf = require("protobufjs"),
    app = require('./app'),
    clc = require('cli-color'),
    events = require('events');

var builder = ProtoBuf.loadJsonFile("./rpc.json");
global.rpc = builder.build('rpc');

var TransUnit = rpc.TransUnit,
    command = rpc.Command;

global.dbReady = new events.EventEmitter();
global.async = require('async');

global.db = require('./db');

dbReady.once('dbReady', function(){
    var server = new Server({
        port: 7707 
    }, handleServerMessage);
    console.log(clc.green('游戏服务器启动成功'));
});

function handleServerMessage(data){
    var self = this;
    console.log('receive', data);
    var request;
    try{
        request = TransUnit.decode(data);
    }catch(e){
        throw new Error('无法解析请求,即将断开客户端连接');
        self.end();
        return;
    }
    console.log(JSON.stringify(request));
    var cmd = "";
    for(var key in command){
        if(command[key] === request['cmd']){
            cmd = key;
            break;
        }
    }
    if(!cmd){
        console.log('no valid cmd', cmd);
        return;
    }
    for(key in rpc){
        if(rpc.hasOwnProperty(key) && key.toUpperCase() === cmd.replace(/_/g,"")){
            console.log('action is ', key);
            var tData;
            try{
                tData = rpc[key].decode(request.data);
            }catch(e){
                throw new Error('无法解析请求,即将断开客户端连接');
                self.end();
                return;
            }
            console.log(tData);
            if(app && app[key]){
                app[key].call(self, tData);
            }
            break;
        }
    }
}
