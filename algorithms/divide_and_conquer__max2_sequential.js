
/*
	Write an efficient program to find the two largest numbers.
	Using Divide and Conquer Technique 
	O(n) => O(n log n)
*/

function _maxCouple(list){ 
	console.log("... << ", list);
	
	if(list.length <= 2 ){
		list[1] = list[1] || 0;
		return list[0]<list[1] ? [list[1], list[0]] : list;
	}else{
		let data = [
			
			_maxCouple( list.slice(0, list.length/2 +1) ),
			_maxCouple( list.slice(list.length/2 +1, list.length+1) )
		]
		
		let i1 = data[0][0] > data[1][0] ? 0 : 1;
		let n1 = data[i1][0];
		let n2 = data[Math.abs(i1-1)][0] > data[i1][1] ?  data[Math.abs(i1-1)][0] : data[i1][1];
		return [n1, n2];
	}
}


var list = [1, 3, 6, 2, 1, 9, 2, 7, 3];

console.log(_maxCouple(list));

