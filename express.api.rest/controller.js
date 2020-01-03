/*
 * @author		Antonio Membrides Espinosa
 * @email    	tonykssa@gmail.com
 * @date		26/12/2019
 * @copyright  	Copyright (c) 2019-2029
 * @license    	GPL
 * @version    	1.0
 * */

var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');
var dbcmd = require('./dbcmd.js').dbcmd;
var data = require('./dbcmd.js').dbdata;

class DefaultController {

    constructor(){
        this.cmd = dbcmd;
        this.driver = null;
        this.path = "data/phonebook.db";
        this.connect(this.path);
    }

    connect(path){
        this.driver = new sqlite3.Database(path, (error) => {
            this.onConnect(error);
        });
    }
    onCreate(){
		console.log("<--------------------------------------------------> onCreate");
		console.log(this.formatSTR(this.cmd.create, []));
		
        this.driver.run(dbcmd.create, (error) => {
            if (error) {
                console.log('<--------------------------------------------------> ERROR-onCreate:'+ error.message);
            }else{
                for(var i in data){
                    //data[i][0] = md5(data[i][0]);
					console.log("<--------------------------------------------------> onFill");
					console.log(this.formatSTR(this.cmd.insert, data[i]));
                    this.driver.run(this.cmd.insert, data[i]);
                }
            }
        })  
    }

    onConnect(error){
        if (error) {
            console.log('<--------------------------------------------------> ERROR-onConnect:'+ error.message);
            console.error(error.message)
            throw error;
        }else{
			console.log('<--------------------------------------------------> onConnect:'+ 'Success Connected');
            this.onCreate();
        }
    }


    onInsert(req, res, next){
        var errors=[];
        if (!req.body.firstname){
            errors.push("No firstname specified");
        }
        if (!req.body.phone){
            errors.push("No phone specified");
        }
        if (errors.length){
			console.log("<--------------------------------------------------> Error-onInsert:" + + errors.join(", "));
            res.status(400).json({"error": "Error-onInsert: " + errors.join(", ")});
            return;
        }
        var data = {
            "id": req.body["id"],
            "firstname": req.body["firstname"],
            "lastname": req.body["lastname"],
            "age": req.body["age"],
            "sex": req.body["sex"],
            "address": req.body["address"],
            "phone": req.body["phone"],
            "avatar": req.body["avatar"],
            "user": req.body["user"],
            "pass":  md5(req.body["pass"])
        }
        var params = [data.firstname, data.lastname, data.age, data.sex, data.address, data.phone, data.avatar, data.id];

		console.log("<--------------------------------------------------> onInsert");
		console.log(this.formatSTR(this.cmd.insert, params));
		
        this.driver.run(this.cmd.insert, params, function (err, result) {
            if (err){
				console.log("<--------------------------------------------------> Error-onInsert:"+err.message);
                res.status(400).json({"error": "Error-onInsert: "+err.message});
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id" : this.lastID
            });
        });
    }
    onUpdate(req, res, next){
			
        var data = {
            "id": req.params.id,
            "firstname": req.body["firstname"],
            "lastname": req.body["lastname"],
            "age": req.body["age"],
            "sex": req.body["sex"],
            "address": req.body["address"],
            "phone": req.body["phone"],
            "avatar": req.body["avatar"],
            "user": req.body["user"],
            "pass":  req.body.pass ? md5(req.body["pass"]) : undefined
        };
        var params = [data.firstname, data.lastname, data.age, data.sex, data.address, data.phone, data.avatar, data.id];
        
		
		console.log("<-------------------------------------------------->  onUpdate");
		console.log(this.formatSTR(this.cmd.update, params));
		
		this.driver.run(this.cmd.update, params, (err, result) => {
                if (err){
					console.log("<--------------------------------------------------> Error-onUpdate: " + err.message);
                    console.log(result);
                    res.status(400).json({"error": "Error-onUpdate: "+res.message})
                    return;
                }
                res.json({
                    'message': "success",
                    'data': data
                })
        });
    }
    onDelete(req, res, next){
		
		console.log("<--------------------------------------------------> onDelete");
		console.log(this.formatSTR(this.cmd.delete, [req.params.id]));
		
        this.driver.run(
            this.cmd.delete,
            req.params.id,
            function (err, result) {
                if (err){
					console.log("<--------------------------------------------------> Error-onDelete: " + err.message);
                    res.status(400).json({"error": "Error-onDelete: " + res.message})
                    return;
                }
                res.json({"message":"deleted", rows: this.changes})
        });
    }
    onSelect(req, res, next){
        var params = [req.params.id];
		
		console.log("<--------------------------------------------------> onSelect by Id");
		console.log(this.formatSTR(this.cmd.obtain, params));
		
        this.driver.get(this.cmd.obtain, params, (err, row) => {
            if (err) {
			  console.log("<--------------------------------------------------> Error-onSelect: " + err.message);
              res.status(400).json({"error": "Error-onSelect: " + err.message});
              return;
            }
            res.json({
                "message":"success",
                "data":row
            })
          });
    }
    onSelectAll(req, res, next){
        var params = [];
		
		console.log("<--------------------------------------------------> onSelect");
		console.log(this.formatSTR(this.cmd.select, params));
		
        this.driver.all(this.cmd.select, params, (err, rows) => {
            if (err) {
				console.log("<--------------------------------------------------> Error-onSelectAll: " + err.message);
                res.status(400).json({"error":err.message});
                return;
            }
            res.json({
                "message":"success",
                "data":rows
            })
        });
    }
	
	formatSTR(str, params){
		var regex = /\?/;
		var _r = function(p, c){ return p.replace(regex,c); }
		return params.reduce(_r, str);
	}
}

module.exports.Default = DefaultController;