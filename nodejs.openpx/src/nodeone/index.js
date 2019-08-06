//................ LIB PATH ..........................................
process.env.NODE_PATH = __dirname + (process.platform == "win32" ? "\\" : "/") + "../../lib/";
require('module').Module._initPaths();
//............... REQUIRE ............................................
var net = require('net');
var assistapp = require('assist-app');
var assisthttp = require('assist-http');
//............... CONFIG .............................................
var config = assistapp.cfg(__dirname);
assisthttp.set(config.general);
//............... SERVER .............................................
var server = net.createServer();
server.listen(config.nodeone.port, config.nodeone.host);
//............... EVENTS .............................................
server.on('listening', function () {
    console.log("\n.................. >> IN  OPENPX NOne << ....................................");
    console.log(process.platform," : " ,this.address());
    console.log(".................. >> END OPENPX NOne << .................................... \n ");
});
server.on('connection', function (client) {
    var tunnel = new net.Socket();
    tunnel.connect(config.nodeone.proxy.port, config.nodeone.proxy.host, function () {
        console.log("Conted to proxy: ", config.nodeone.proxy);
    });
    tunnel.on("data", function (data) {
        if(!client.write(data)) tunnel.pause();
    });
    tunnel.on("drain", function (data) {
        tunnel.resume();
    });
    tunnel.on("error", function (e) {
        console.log("Could not connect to service at host " + config.nodeone.proxy.host + ', port ' + config.nodeone.proxy.port);
        client.end();
    });
    tunnel.on("close", function (had_error) {  client.end(); });

    client.on("data", function (data) {
        dispatch(config.nodetwo, data, tunnel, client);
    });
    client.on("drain", function (data) {
        client.resume();
    });
    client.on("error", function (e) {
        tunnel.end();
    });
    client.on("close", function (had_error) { tunnel.end(); });
});
//............... DISPATCH .............................................
function dispatch(opt, data, tunnel, client) {
    opt.raw = data;
    opt.method = 'POST';
    var reqest = assisthttp.pack(opt);
    if(!tunnel.write(reqest)) client.pause();
    console.log('\n<<<<<<<<< head: ', data.toString(), "\n", reqest);
}
//............... COMMENTS .............................................
/*
 * general options:
 *   "package" : "plain",  >> text|req|file
 *   "cipher": "hex",      >> hex|base64|binary
 *   "tunnel": "http"      >> http|https|ws|wss
 * */
