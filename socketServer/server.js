var net = require('net');
var clc = require('cli-color');
/**
 * 所有建立连接的sockets对象
 * @type {Array}
 */

function showTotal(Server){
    Server.getConnections(function(err, ecount){
        if(err){
            console.log('get connections error', e);
            return;
        }
        console.log(clc.green('total sockets online is'), ecount);
    });
}

var GServers = function(cfg, handleMessage, options){
    var GServer = net.createServer(function(socket){
        var _GServer = this;
        socket.setKeepAlive(true, 60000);
        socket.on('end', function(){
            console.log('socket end');
            showTotal(_GServer);
        });
        socket.on('close', function(){
            console.log('socket close done'); 
            showTotal(_GServer);
        });
        socket.on('error', function(e){
            console.log('socket error', e);
            this.destroy();
            showTotal(_GServer);
        });
        socket.on('data', handleMessage || function(data){
            console.log('please setup handle message function');
            console.log(data.toString());
        });
    });

    GServer.listen(cfg.port || 9220, function(){
        console.log(clc.green('start server on port'), cfg.port || 9220);
    });

    GServer.on('connection', function(socket){
        console.log('some one connected');
        showTotal(this);
    });
    return GServer;
};

/**
 * 自定义Server的一些方法
 * @type {Object}
 */
GServers.prototype = {
};

module.exports = GServers;