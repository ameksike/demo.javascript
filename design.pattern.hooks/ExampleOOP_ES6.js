class Person{
		name;
		age;
		
		constructor(name, age ){
			this.name = name || 'Yanet';
			this.age = age || 12;
		}
		
		speak(){
			return "Hello! I am " + this.name;
		}
	}
	
	
	class Worker extends Person{
		company;
		constructor(company, name, age ){
			super(name, age);
			this.company = company;
		}
		
		work(){
			return "i am working "+ this.name;
		}	
		
		speak(){
			return super.speak() + " -- i am a worker!!!" ;
		}
	}	
	
	
	
	var obj1 = new Person();
	var obj2 = new Person("Julian");
	var obj3 = new Worker("Labiofam", 'Tony', 34);
			
	console.log(obj1.name);
	console.log('----------------');