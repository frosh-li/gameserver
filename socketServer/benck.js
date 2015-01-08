var net = require('net');

var ProtoBuf = require("protobufjs");
var builder = ProtoBuf.loadJsonFile("../rpc.json");
var rpc = builder.build("rpc");
var uuid = require("uuid");
var TransUnit = rpc.TransUnit;
var command = rpc.Command;
var UserCreateRequest = rpc.UserCreateRequest;
console.log(TransUnit);
var clients = process.argv[2];
for(var i = 0 ; i < clients; i++){
    var client = net.connect({
        port: 9001
    },function(){
        console.log('connect to server!');
        console.log(UserCreateRequest);
        var _UserCreateRequest = new UserCreateRequest({
            email:uuid.v1()+"@163.com",
            pass:"123456",
            channel:"SDK_91_IOS",
            client_version:"1.0.0",
            device_id:uuid.v1()
        });
        var _TransUnit = new TransUnit({
            cmd:"USER_CREATE_REQUEST",
            data: _UserCreateRequest.toBuffer(),
            flags: 1,
            usn: 1
        });
        console.log('send', _TransUnit.toBuffer());
        this.write(_TransUnit.toBuffer());
    });

    client.on('data', function(data){
        console.log(data);
        var request = TransUnit.decodeHex(data);
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
                var tData = rpc[key].decode(request.data);
                console.log(tData);
                break;
            }
        }
        if(cmd === "USER_CREATE_REPLY"){
            return;
            //准备发送获取用户信息的接口
            var _UserLogInRequest = new rpc.UserLogInRequest({
                email:"junguoliang@163.com",
                pass:"123456",
                channel:"SDK_91_IOS",
                client_version:"1.0.0",
                device_id:"101010"
            });
            var _TransUnit = new TransUnit({
                cmd:"USER_LOG_IN_REQUEST",
                data: _UserLogInRequest.toBuffer(),
                flags: 1,
                usn: 1
            });
            console.log('send', _TransUnit.toBuffer());
            this.write(_TransUnit.toBuffer());
        }
    });

    client.on('end', function(){
        console.log('disconnected from server');
    });
}
