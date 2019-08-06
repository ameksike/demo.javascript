var spawn = require('child_process').spawn;
var extrartor = require('assist-app');
var config = extrartor.cfg(__dirname);
//...............................................
function runNodeOne(config){
    var bin = spawn(extrartor.bin(config.bin), [ extrartor.mod("nodeone") ]);
    bin.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    bin.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    bin.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
}
function runCNTLM(config){
    //console.log("\n cntlm:", config);
    var bin = spawn(extrartor.bin(config.bin), [
        "-fl", config.port,
        "-p", config.proxy.pass,
        "-u", config.proxy.user,
        "-d", config.proxy.domain,
        config.proxy.host + ":" + config.proxy.port
    ]);
    bin.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    bin.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    bin.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
    //-fl 3129 -p asusCUBA2100 -u firomero -d uci.cu 10.0.0.1:8080
}
//...............................................
runNodeOne(config.nodeone);
runCNTLM(config.cntlm);