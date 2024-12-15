/**
 * Find the two oldest and two youngest people from a list of people
 * @param {Array} people - List of people with name and age
 * @returns {Object} Object containing oldest and youngest people
 */
function findAgeExtremes(people) {
    // Validate input
    if (!Array.isArray(people) || people.length < 2) {
        throw new Error('Input must be an array with at least two people');
    }

    // Sort people by age in ascending and descending order
    const sortedByAge = [...people].sort((a, b) => a.age - b.age);

    return {
        oldest: sortedByAge.slice(-2).reverse(),
        youngest: sortedByAge.slice(0, 2)
    };
}

// Example usage
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 22 },
    { name: 'David', age: 45 },
    { name: 'Eve', age: 35 }
];

const ageExtremes = findAgeExtremes(people);
console.log('Oldest:', ageExtremes.oldest);
console.log('Youngest:', ageExtremes.youngest);