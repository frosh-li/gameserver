var app = {};
var fs = require('fs');
app.UserCreateRequest = require("./UserCreateRequest.js");
fs.watch( "./app", function( emit, filenameext ) {
    if ( emit == "change" || emit == 'rename') {
        console.log( "file changed", filenameext );
        if (filenameext.indexOf(".js") > -1) {
            setTimeout(function() {
                delete require.cache[ require.resolve("./"+filenameext) ];
                app[filenameext.replace(".js","")] = require(require.resolve("./"+filenameext));
            }, 1000 );
        }
    }
});
module.exports = app;