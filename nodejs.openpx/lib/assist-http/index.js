/*
 * @framework: Ksk
 * @package: web
 * @version: 0.1
 * @description: This is simple and light HTTP assist
 * @authors: ing. Antonio Membrides Espinosa
 * @made: 15/12/2014
 * @update: 15/12/2014
 * @license: GPL v3
 * @require: nodejs >= 0.8, assist-cipher, url
 */
var AssistHTTP = function(){
    var self = this;
    this.package = "plain";
    this.cipher = require('assist-cipher');
    this.url = require('url');

    this.set = function(option){
        self.package = option.package;
        self.cipher.algorithm = option.cipher;
    }
    this.pack = function(opt){
        switch (self.package){
            default:
                var reqest = self.getHead(opt);
                reqest += "Host: " + opt.host + ":" + opt.port + "\r\n";
                for(var i in opt.headers)
                    reqest += i + ": " + opt.headers[i] + "\r\n";
                if(opt.raw){
                    opt.raw = self.cipher.encode(opt.raw);
                    reqest += "Content-Type: application/x-www-form-urlencoded;charset=utf-8\r\n";
                    reqest += "Content-Length: " + Buffer.byteLength(opt.raw, 'utf8') + "\r\n";
                }
                reqest += "\r\n";
                if(opt.raw){
                    reqest += opt.raw + "\r\n";
                    reqest += '\r\n';
                }
                return reqest;
             break;
        }
    }
    this.unpack = function(data){
        switch (self.package){
            case "req":
                var opt = self.getOptUrl(data.url);
                opt['url'] = data.url;
                opt['headers'] = data.headers;
                opt['method'] = data.method;
                return opt;
            break;
            default:
                if(typeof (data) !== 'string') return {};
                if(data.length <= 0) return {};
                var dta = self.cipher.decode(data);
                return (!self.hasHeader(dta)) ? dta : self.getOptHeadFull(dta);
            break;
        }
    }
    this.hasHeader = function(data){
        data = (data instanceof Buffer) ? data.toString : data;
        if(typeof data !== 'string') return false;
        return (parseInt(data.search(/^(GET|PUT|POST|DELETE|CONNECT|TRACE|OPTIONS|HEAD) ((\w)+\:\/\/)?(.)+ ((\w)+\/(\d|\.)+)+$/m))  > -1);
    }
    this.getHead = function(opt){
        opt.method = opt.method || "GET";
        opt.version = opt.version || "HTTP\/1.1";
        return opt.method + " " + self.getUrl(opt) + " " + opt.version + "\r\n";
    }
    this.getContentLength = function(req){
        var bytes = req.match(/(Content-Length: (\d)+|Content-Length:(\d)+)/g);
        bytes = bytes[0].split(":");
        return parseInt(bytes[1]);
    }
    this.getProtocolByPort = function(port){
        var protocol = {
            "20": "ftp",        //... (TCP), FTP (File Transfer Protocol) para datos
            "21": "ftp",        //... (TCP), FTP (File Transfer Protocol) para control
            "22": "ssh",        //... (SSH), Acceso remoto seguro
            "23": "telnet",     //... (Telnet), Acceso Remoto
            "25": "smtp",       //... (TCP), SMTP (Simple Mail Transfer Protocol)
            "37": "time",       //... Este servicio te da la hora del sistema.
            "53": "dns",        //... (TCP), DNS (Domain Name System) | (UDP), DNS (Domain Name System)
            "67": "bootp",      //... (UDP), BOOTP BootStrap Protocol (Server) y por DHCP
            "68": "bootp",      //... (UDP), BOOTP BootStrap Protocol (Client) y por DHCP
            "69": "tftp",       //... (UDP), TFTP (Trivial File Transfer Protocol)
            "80": "http",       //... (TCP), HTTP (HyperText Transfer Protocol)
            "88": "kerberos",   //... (TCP), Kerberos (agente de autenticación)
            "110": "pop3",      //... (TCP), POP3 (Post Office Protocol)
            "113": "auth",      //... Servicio de autenticación.
            "137": "netbios-ns",//... (TCP), NetBIOS (servicio de nombres) | (UDP), NetBIOS (servicio de nombres)
            "138": "netbios-dg",//... (TCP), NetBIOS (servicio de envío de datagramas) | (UDP), NetBIOS (servicio de envío de datagramas)
            "139": "netbios-ssn",//.. (TCP), NetBIOS (servicio de sesiones) | (UDP), NetBIOS (servicio de sesiones)
            "143": "imap",      //... (TCP), IMAP4 (Internet Message Access Protocol)
            "161": "snmp",      //... Simple Network Management Protocolo (SNMP), es el protocolo de gestión de dispositivos de red y sus funciones.
            "194": "irc",       //... Protocolo de Chat. Internet Relay Chat (IRC), es un sistema de comunicación instantánea que está envuelto en una serie de reglas cliente-servidor.
            "443": "https",     //... (TCP), HTTPS/SSL (transferencia segura de páginas web)
            "530": "rpc",       //... Remote Procedure Call (RPC), es un protocolo que un programa puede usar para solicitar un servicio de un programa que se encuentra en otro ordenador.
            "631": "cups",      //... (TCP), CUPS (sistema de impresión de Unix)
            "993": "imaps",     //... (TCP), IMAP4 sobre SSL
            "995": "pop3s",     //... (TCP), POP3 sobre SSL
            "1080": "socks",    //... (TCP), SOCKS Proxy
            "1433": "mss",      //... (TCP), Microsoft-SQL-Server
            "1434": "msm",      //... (TCP), Microsoft-SQL-Monitor | (UDP), Microsoft-SQL-Monitor
            "1701": "eavl",     //... (UDP), Enrutamiento y Acceso R. para VPN con L2TP.
            "1723": "eavl",     //... (TCP), Enrutamiento y Acceso R. para VPN con PPTP.
            "1761": "nzrcu",    //... (TCP), Novell Zenworks Remote Control utility
            "1863": "msn"       //... (TCP), MSN Messenger
        }
        return protocol[port] ? protocol[port] : "http";
    }
    this.getMethod = function(req){
        var method = req.match(/GET|PUT|POST|DELETE|CONNECT|TRACE|OPTIONS|HEAD/);
        return method[0];
    }
    this.getUrl = function(opt){
        opt.port =  opt.port || 80;
        opt.protocol = opt.protocol || self.getProtocolByPort(opt.port);
        opt.path = opt.path || "";
        return opt.protocol+"://"+opt.host+":"+opt.port+"/"+opt.path;
        //return self.url.format(opt)
    }
    this.getReq = function(opt, req){
        opt.version = opt.version || "HTTP\/1.1";
        var lreq = req.replace(
            /(GET|PUT|POST|DELETE|CONNECT|TRACE|OPTIONS|HEAD) (.)+ HTTP\/1.1\r\n/,
            opt.method+" "+self.getUrl(opt)+" "+opt.version+"\r\n"
        );
        lreq = lreq.replace(/Host: (.)+\r\n/, "Host: "+opt.host+":"+opt.port+"\r\n");
        lreq = lreq.replace(/Origin: (.)+\r\n/, "Origin: "+self.getUrl(opt)+"\r\n");
        lreq = lreq.replace(/Referer: (.)+\r\n/, "Referer: "+self.getUrl(opt)+"\r\n");
        return lreq;
    }
    this.validReq = function(req, opt){
        var res = true;
        for(var i in opt.valid){
            var value = req.search(new RegExp(opt.valid[i]));
            res = (res && value!==-1);
            //console.log("\n"+i+": ", value, " fin:", res) ;
        }
        return res;
    }
    this.getOptUrl = function(url){
        if(typeof (url) === 'string' ){
            url = (url.length <= 1) ? "localhost" + url : url;
            url = (url.search(/\w:\/\//i) == -1) ? "undefined://" + url : url;
            var opt = self.url.parse(url);
            opt['port'] = opt['port'] || '80';
            opt['url'] = opt['href'];
            opt['protocol'] = (opt['protocol']==='undefined:') ? self.getProtocolByPort(opt['port'])+":" : opt['protocol'];
            opt['protocol'] = opt['protocol'].slice(0, -1);
            return opt;
        }
        return url;
    }
    this.getOptHead =  function(req){
        var line = req.match(/(.)+$/m);
        line = line[0].split(" ");
        var opt = self.getOptUrl(line[1]);
        opt["method"] = line[0];
        opt["version"] = line[2];
        return opt;
    }
    this.getOptHeadFull = function(data){
        var lst = data.split("\r\n");
        var head = lst[0].split(" ");
        var opt = self.getOptUrl(head[1]);
        var tmp = self.getOptHeaders(lst);
        opt['method'] = head[0];
        opt['version'] = head[2];
        opt['headers'] = tmp.headers;
        opt['raw'] = tmp.data;
        opt['req'] = data;
        return opt;
    }
    this.getOptHeaders = function(lst){
        delete lst[0];
        var obj = { headers: {}, data: '' };
        for(var i in lst){
            var tlst = lst[i].split(": ");
            if(tlst[1] === undefined)
                obj.data += tlst[0];
            else obj.headers[tlst[0]] = tlst[1];
        }
        return obj;
    }
}
//... export lib under nodejs ..... AssistHTTP.apply(exports, []);
module.exports = new AssistHTTP;
//... utils string functions ...
String.prototype.count = function(reg, attr){
    return (this.length - this.replace(new RegExp(reg, attr), "").length) / reg.length;
}
String.prototype.bytes = function(encode){
    encode = encode || 'utf8';
    var text = this.toString();
    return Buffer.byteLength(text, encode);
}