module.exports.dbcmd = {
	"create": "CREATE TABLE IF NOT EXISTS person (id  INTEGER PRIMARY KEY AUTOINCREMENT, firstname VARCHAR, lastname VARCHAR, age INTEGER, sex CHAR, address VARCHAR, phone VARCHAR, avatar VARCHAR ) ",
	"delete": "DELETE FROM person WHERE id=?",
	"select": "SELECT * FROM person",
	"obtain": "SELECT * FROM person WHERE id = ?",
	"update": "UPDATE person SET firstname=?, lastname=?, age=?, sex=?, address=?, phone=?, avatar=? WHERE id=?",
	"insert": "INSERT INTO person(firstname, lastname, age, sex, address, phone, avatar) VALUES(?,?,?,?,?,?,?)"
}


module.exports.dbdata = [
//	["firstname", "lastname", "age", "sex", "address", "phone", "avatar"],
	["Misto", "Pelusa", "55", "M", "Lincon Street", "85858584", "avatar"]
]