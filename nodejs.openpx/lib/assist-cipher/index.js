/*
 * @framework: Ksk
 * @package: web
 * @version: 0.1
 * @description: This is simple and light cipher assist under: utf8, hex and base64 encode
 * @authors: ing. Antonio Membrides Espinosa
 * @made: 15/12/2014
 * @update: 15/12/2014
 * @license: GPL v3
 * @require: nodejs >= 0.8, buffer
 */
var AssistCipher = function(){
    var self = this;
    this.key = 'certify=7f935';
    this.algorithm = "base64";

    this.encode = function(data){
        switch (self.algorithm){
            case "utf8": case "hex": case "base64":
                return self.key + (new Buffer(data)).toString(self.algorithm);
            break;
            default: return data; break;
        }
    }
    
    this.decode = function(data){
        switch (self.algorithm){
            case "utf8": case "hex": case "base64":
                if(typeof (data) === "string"){
                    var dta = data.split(self.key);
                    return (new Buffer(dta[1], self.algorithm)).toString();
                }else { console.log("Error cipher decode: ", data); return " "; }
            break;
            default: return data; break;
        }
    }
}
//... export lib under nodejs .....
module.exports = new AssistCipher;