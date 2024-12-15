/**
 * @description Find the two oldest and two youngest list from a list of list
 * @param {Array} list - List of list with name and age
 * @returns {Object} Object containing oldest and youngest list
 */
function findExtremes(list, count = 2, fn) {
    // Validate input
    if (!Array.isArray(list) || list.length < count) {
        throw new Error('Input must be an array with at least two list');
    }
    // Define sort function 
    fn = fn instanceof Function ? fn : (a, b) => a.age - b.age;
    // Sort list by age in ascending and descending order
    const sortedBy = [...list].sort(fn);
    return {
        maxs: sortedBy.slice(-1 * count).reverse(),
        mins: sortedBy.slice(0, count),
        sort: sortedBy
    };
}

// Example usage
const list = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 22 },
    { name: 'David', age: 45 },
    { name: 'Eve', age: 35 }
];

const ageExtremes = findAgeExtremes(list);
console.log('Oldest:', ageExtremes.oldest);
console.log('Youngest:', ageExtremes.youngest);




/**
 * @description Get the max and min from a list
 * @param {Array} list 
 * @param {Function} [fn] 
 * @returns {{max:Object; min:Object}}
 */
function getExtremes(list, fn = null) {
    fn = fn instanceof Function ? fn : (obj) => obj?.age || 0;
    let max = list[0], min = list[0];
    for (let itm of list) {
        if (fn(itm) > fn(max)) {
            max = itm;
        }
        if (fn(itm) < fn(min)) {
            min = itm;
        }
    }
    return { max, min };
}
console.log(getExtremes(list));