/*
 * @framework: Ksk
 * @package: web
 * @version: 0.1
 * @description: This is simple and light app assist
 * @authors: ing. Antonio Membrides Espinosa
 * @made: 13/12/2014
 * @update: 13/12/2014
 * @license: GPL v3
 * @require: nodejs >= 0.8, fs
 */
var fls = require('fs');
var AssistApp = function()
{
	var self = this;
	this.cfg = function(path, filename){
		filename = filename || "config.json";
		path = path ? path +self.bs() : '';
		var file = path + "../../cfg/"+filename;
		return fls.existsSync(file) ? JSON.parse(fls.readFileSync(file)) : {};
	}
	this.bs  = function(){
		switch(process.platform){
			case "win32":  return "\\"; break;
			default: return "/"; break;
		} 
	}
    this.ext = function(){
        switch(process.platform){
            case "win32":  return ".exe"; break;
            default: return ""; break;
        }
    }
    this.bin = function(name){
       return __dirname+self.bs()+"../../../bin/"+name+"/"+process.platform+"/"+name+self.ext();
    }
    this.mod = function(name){
        return __dirname+self.bs()+"../../../src/"+name+"/";
    }
}
//... export lib under nodejs .....
module.exports = new AssistApp;
