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

/**
 * @description Searching based on the default comparison function is maximum
 * @param {Array<Object>} list 
 * @param {Function} fn 
 * @returns {Object}
 */
function getByFn(list, fn = null) {
    fn = fn instanceof Function ? fn : (stored, current) => (current?.age || 0) > (stored?.age || 0);
    if (!list || list.length === 0) return null;
    return list.reduce((stored, current) => fn(stored, current) ? current : stored);
}

console.log(getByFn(people, (s, c) => c.age < s.age)) // minimum 
console.log(getByFn(people)) // maximum  

/**
 * @description High-performance approach to getByFn
 * @param {Array<Object>} list 
 * @param {Function} [fn] 
 * @returns {Object}
 */
function getByFnIterative(list, fn = null) {
    if (!list || list.length === 0) return null;
    fn = fn instanceof Function ? fn : (stored, current) => (current?.age || 0) > (stored?.age || 0);
    let stored = list[0];
    // Single-pass algorithm
    for (let i = 1; i < list.length; i++) {
        if (fn(stored, list[i])) {
            stored = list[i];
        }
    }
    return stored;
}

console.log(getByFnIterative(people, (s, c) => c.age < s.age)) // minimum 
console.log(getByFnIterative(people)) // maximum  

/**
 * @description get average function 
 * @param {Array<Object>} list 
 * @param {Function} [fn] 
 * @param {Number} [fixed=2] 
 * @returns 
 */
function getAverage(list, fixed = 2, fn = null) {
    if (!list || list.length === 0) return 0;
    fn = fn instanceof Function ? fn : (current) => current?.age || 0;
    const total = list.reduce((stored, current) => stored + fn(current), 0);
    return Number((total / list.length).toFixed(fixed));
}