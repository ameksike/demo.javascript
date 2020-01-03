#Simple NodeJs Express API REST

# develop steps
- npm init
- npm install express --save
- npm install sqlite3 --save

# run steps
- npm run start 

# used steps

#................................................ SELECT ALL

Request:
	GET http://localhost:8000/phonebook/
	
Response:

	{
		"message": "success",
		"data": [ {}, ..., {} ]
	}

#................................................ SELECT

Request:
	GET http://localhost:8000/phonebook/4
	
Response:

	{
		"message": "success",
		"data": {
			"id": 4,
			"firstname": "Magma",
			"lastname": "Mangrino Perez",
			"age": 44, "sex": "M",
			"address": "Lincon Street",
			"phone": "45668899",
			"avatar": "./assets/person/img3-small.jpg",
			"pass": "64sfsadf2as3df13asdf",
			"user": "magma.mangrino"
		}
	}

#................................................ DELETE

Request:
	DELETE http://localhost:8000/phonebook/33
	
Response:

	{
		"message": "deleted",
		"rows": 1
	}

#................................................ UPDATE

Request:

	PATCH/PUT http://localhost:8000/phonebook/4
	{
		"firstname":"Magma",
		"lastname":"TUSCA Perez",
		"age":44, "sex":"M",
		"address":"Lincon Street",
		"phone":"45668899",
		"avatar":"./assets/person/img3-small.jpg",
		"pass":"null",
		"user":"magma.perez"
	}

Response:

	{
		"message": "success",
		"data": {
			"id": "4",
			"firstname": "Magma",
			"lastname": "TUSCA Perez",
			"age": 15, "sex": "M",
			"address": "Lincon Street",
			"phone": "45668899",
			"avatar": "./assets/person/img3-small.jpg",
			"user": "magma.perez",
			"pass": "37a6259cc0c1dae299a7866489dff0bd"
		}
	}

#................................................ INSERT 

Request:

	POST http://localhost:8000/phonebook
	{
	  "firstname":"Magma",
	  "lastname":"Mangrino Perez",
	  "age":44, "sex":"M",
	  "address":"Lincon Street",
	  "phone":"45668899",
	  "avatar":"./public/person/img3-small.jpg",
	  "pass": "mio",
	  "user": "magma.mangrino"
	}

Response:

	{
		"message":"success",
		"data":{
			"firstname":"Magma",
			"lastname":"Mangrino Perez",
			"age":44, "sex":"M",
			"address":"Lincon Street",
			"phone":"45668899",
			"avatar":"./public/person/img3ll.jpg",
			"user":"magma.mangrino",
			"pass":"78c925a3a4b36984d1bcbbb01457eec6"
		},
		"id":34
	}	