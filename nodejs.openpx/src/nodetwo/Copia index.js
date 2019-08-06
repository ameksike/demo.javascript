//............... REQUIRE .............................................
var net = require('net');
var assistapp = require('assist-app');
var assisthttp = require('assist-http');
//............... CONFIG .............................................
var config = assistapp.cfg(__dirname);
assisthttp.set(config.general);
//............... SERVER .............................................
var server = net.createServer();
server.listen(config.nodetwo.port, config.nodetwo.host);
//............... EVENTS .............................................
server.on('listening', function () {
    console.log("\n.................. >> IN  OPENPX NTwo << ....................................");
    console.log(process.platform," : " ,this.address());
    console.log(".................. >> END OPENPX NTwo << .................................... \n ");
});
server.on('connection', function (client) {
    var req = '';
    var tunnel = new net.Socket();
    tunnel.connected = false;
    tunnel.on('data', function (data) {
        if (!client.write(data)) tunnel.pause();
    });
    tunnel.on('drain', function () {
        tunnel.resume();
    });
    tunnel.on("error", function (e) {
        console.log("Could not connect to service at host ", e);
        client.end();
        tunnel.connected = false;
        //dispatch.apply(this, tunnel.lastReq);
    });
    tunnel.on("close", function (had_error) {  client.end(); tunnel.connected = false; });
    tunnel.on("end", function (had_error) {  client.end(); tunnel.connected = false; });

    client.on("data", function (data) {
        req += data.toString();
        if(req.count('\r\n\r\n', 'g')){
            var lreq = req.split("\r\n\r\n");
            if(req.count('Content-Length:', 'ig')){
                if(lreq[1].bytes() === assisthttp.getContentLength(lreq[0])){
                    dispatch(lreq, tunnel, client);
                    req = '';
                }
            }else{
                dispatch(lreq, tunnel, client);
                req = '';
            }
        }
    });
    client.on('drain', function () {
        client.resume();
    });
    client.on("close", function (had_error) { tunnel.end(''); });
    client.on("error", function (e) {
        tunnel.end('');
    });
});
//............... DISPATCH .............................................
function reverse(req, config){
    var opt = assisthttp.getOptHead(req[0]);
    for(var i in config.mask)
        opt[i] = config.mask[i];
    opt.hostname = opt.host;
    opt.req = assisthttp.getReq(opt, req.join("\r\n\r\n"));
    return opt;
}
function dispatch(req, tunnel, client) {
    var opt = (!assisthttp.validReq(req[0], config.nodetwo)) ? reverse(req, config.nodetwo) : assisthttp.unpack(req[1]);
    if(typeof(opt) === 'object'){
        tunnel.connect(opt.port, opt.hostname, function () {
            tunnel.connected = true;
            if(opt.method === 'CONNECT'){
                client.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            }
            if(!tunnel.write(opt.req)) client.pause();
            mylog(opt.req);
        });
    }else{
        if(tunnel.connected){
            if(!tunnel.write(opt)) client.pause();
            console.log("\n raw <<<< ", opt);
        }else{
            console.log("\nError: connection it's loused\n");
        }
    }
    tunnel.lastReq = [req, tunnel, client];
}
//............... COMMENTS .............................................
/*
 * general options:
 *   "package" : "plain",  >> text|req|file
 *   "cipher": "hex",      >> hex|base64|binary
 *   "tunnel": "http"      >> http|https|ws|wss
 * */
function mylog(dta){
    require('fs').writeFileSync(__dirname+"\\"+"../../log/"+Date.now()+"-reqtwo.txt" , dta);
}