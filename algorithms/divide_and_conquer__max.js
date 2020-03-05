
/*

	In computer science, divide and conquer is an algorithm design paradigm based on multi-branched recursion. 
	A divide-and-conquer algorithm works by recursively breaking down a problem into two or more sub-problems of the same or related type, 
	until these become simple enough to be solved directly.
	
	Using Divide and Conquer Technique 
	O(n) => O(n log n)

*/

function _max(list){ //... O(n) => O(n log n)
	console.log("... << ", list);
	
	if(list.length <= 2 ){
		let t1 = list[0];
		let t2 = list[1] || 0;
		return t1 < t2 ? t2 : t1;
	}else{
		let n1 = _max( list.slice(0, list.length/2 +1) );
		let n2 = _max( list.slice(list.length/2 +1, list.length+1) );
		return n1 > n2 ? n1 : n2;
	}
}


var list = [1, 3, 6, 2, 1, 9, 2, 7, 3];

console.log(_max(list));

