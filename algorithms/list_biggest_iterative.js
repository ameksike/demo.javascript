const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 22 },
    { name: 'David', age: 45 },
    { name: 'Eve', age: 35 }
];

/**
 * @description Get the last two maximum of a list where max1 > max2
 * @param {Array} list 
 * @param {Function} [fn] 
 * @returns {{max1:Object; max2:Object}}
 */
function getLastTwoMax(list, fn = null) {
    fn = fn instanceof Function ? fn : (obj) => obj?.age || 0;
    let max1 = null, max2 = null;
    for (let itm of list) {
        if (fn(itm) > fn(max1)) {
            max2 = max1;
            max1 = itm;
        } else if (fn(itm) > fn(max2)) {
            max2 = itm;
        }
    }
    return { max1, max2 };
}


console.log(getLastTwoMax(people));