//............... REQUIRE .............................................
var net = require('net');
var http = require('http');
var extrartor = require('extrartor');
var pkextract = require('pkextract');
var it=0;
//............... CONFIG .............................................
var config = extrartor.cfg(__dirname);
pkextract.set(config.general);
//............... SERVER .............................................
var server = http.createServer();
server.listen(config.nodetwo.port, config.nodetwo.host);
//............... EVENTS .............................................
server.on('request', function (req, res) {
    var dta = '';
    req.on('data', function (data) {
        dta += data;
    });
    req.on('end', function () {
        var opt = pkextract.unpack(dta);
        if(opt.protocol === undefined){
            pkextract.package = 'req';
            opt = pkextract.unpack(req);
            opt.raw = dta;
        }
        dispatch(opt, res, req);
    });
});
server.on('listening', function () {
    console.log("\n.................. >> IN  OPENPX NTwo << ....................................");
    console.log(this.address());
    console.log(".................. >> END OPENPX NTwo << ....................................\n");
});
//............... DISPATCH .............................................
function dispatch(opt, res, req) {
    console.log(".................. >> IN  OPT << ....................................");
    console.log(opt);
    console.log(".................. >> END OPT << .................................... \n ");/**/
    switch (opt.protocol) {
        case "http:":
            var request = require('request');
            delete opt.protocol;
            delete opt.headers["Connection"];
            var nreq = request(opt);
            if (opt.method !== 'GET') {
                nreq.write(opt.raw + "\n");
            }
            nreq.on('error', function (e) {
                console.log(e);
            });
            nreq.on('data', function (data) {
                if (!res.write(data)) nreq.pause();
            });
            nreq.on('drain', function () {
                nreq.resume();
            });
            nreq.on('response', function (nres) {
                //res.writeHead(200, nres.headers);
                for (var i in nres.headers) {
                    res.setHeader(i, nres.headers[i]);
                }
            });
            nreq.pipe(res);
            nreq.end();
            break;
        case "httpst:":
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            opt.rejectUnauthorized = false;
            var https = require('https');
            var nreq = https.request(opt);
            nreq.on('error', function (e) {
                console.log(e);
                res.end('error');
            });
            nreq.on('data', function (data) {
                if (!res.write(data)) nreq.pause();
            });
            nreq.on('drain', function () {
                nreq.resume();
            });
            nreq.pipe(res);
            break;
        default:
            console.log("default", opt);
            var srvSocket = net.connect(opt.port, opt.hostname, function () {
                res.socket.write('HTTP/1.1 200 Connection Established\r\n' + '\r\n');
                srvSocket.pipe(res.socket);
                res.socket.pipe(srvSocket);
            });
            srvSocket.on('error', function (e) {
                console.log("\n.................. >> IN  ERROR << .................................... \n ");
                console.log(e);
                console.log("\n.................. >> END ERROR << .................................... \n ");
            });
            break;
    }
}
//............... COMMENTS .............................................
/*
 * https error:
 *   SELF_SIGNED_CERT_IN_CHAIN
 *   UNABLE_TO_VERIFY_LEAF_SIGNATURE
 *   DEPTH_ZERO_SELF_SIGNED_CERT
 * */