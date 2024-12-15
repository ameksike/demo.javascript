/**
    Quadruplet sums
    Implement a function which finds four numbers within the provided list which have a sum equal to the target.

    An example is provided, but is too slow on larger testcases because it has too many nested loops.

    - There will always be at least one valid quadruplet.
    - The same number can be used any number of times.
    - Numbers can be returned in any order.
 */

/**
 * @description O(n^4)
 * @param {*} numbers 
 * @param {*} target 
 * @returns 
 */
function findQuadrupletSum(numbers, target) {
    /*
    Finds four integers within `numbers` whose sum amounts to
    exactly `target`, and returns them.
 
    There will always be a valid quadruplet, and the same number
    can be picked several times.
    */
    for (let a of numbers) {
        for (let b of numbers) {
            for (let c of numbers) {
                for (let d of numbers) {
                    if (a + b + c + d === target) {
                        return [a, b, c, d];
                    }
                }
            }
        }
    }
}

function findQuadrupletSumFast(numbers, target) {
    // TODO: Code the same function as above, but faster!
    return [];
}

/**
 * @description Finds four integers in the array that sum up to the target: O(n^3)
 * @param {number[]} numbers - Input array of integers
 * @param {number} target - Target sum
 * @returns {number[]} Quadruplet that sums to the target
 */
function findQuadruplet_Demo1(numbers, target) {
    const n = numbers.length;

    // Optimization: Sort the array to enable more efficient searching
    numbers.sort((a, b) => a - b);

    // Iterate through first two numbers
    for (let i = 0; i < n - 3; i++) {
        for (let j = i; j < n - 2; j++) {
            // Two-pointer technique for the remaining two numbers
            let left = j + 1;
            let right = n - 1;

            while (left < right) {
                const currentSum = numbers[i] + numbers[j] + numbers[left] + numbers[right];

                if (currentSum === target) {
                    // Found a valid quadruplet
                    return [numbers[i], numbers[j], numbers[left], numbers[right]];
                }

                if (currentSum < target) {
                    // Sum is too small, move left pointer to increase
                    left++;
                } else {
                    // Sum is too large, move right pointer to decrease
                    right--;
                }
            }
        }
    }

    // This should never happen as per problem statement
    throw new Error('No valid quadruplet found');
}

// =============== DO NOT EDIT BELOW THIS LINE ===============

function runTestcase(numbers, target, testcaseName) {
    console.log(testcaseName.padEnd(25), '-');
    const t0 = performance.now();
    const result = findQuadrupletSumFast(numbers, target);
    const elapsed = performance.now() - t0;

    if (!Array.isArray(result)) {
        console.error(`FAILED: the function returned ${result} of type ${typeof result}, not an array.`);
        process.exit(1);
    }

    if (result.length !== 4) {
        console.error(`FAILED: the result has ${result.length} elements, not 4`);
        process.exit(1);
    }

    if (result.reduce((a, b) => a + b, 0) !== target) {
        console.error(`FAILED: the sum of ${result} is ${result.reduce((a, b) => a + b, 0)}, not ${target}`);
        process.exit(1);
    }

    if (result.some(r => !numbers.includes(r))) {
        console.error('FAILED: one of the numbers is not in the list');
        process.exit(1);
    }

    console.log('PASSED');
}

runTestcase([5, 4, 3, 2, 1, 0], 11, 'Small testcase');
runTestcase([54, 3, 42, 16, 4, 24], 90, 'Solution with duplicates');
runTestcase([89, -62, -92, -37, 28, 29], -7, 'With negative numbers');
runTestcase([39, -57, -53, -79, 83, -6, 27, -97], 0, 'Target is zero');

for (let i = 1; i <= 5; i++) {
    const numbers = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 200000000 - 100000000));
    const target = numbers.slice(-4).reduce((a, b) => a + b, 0);  // Make sure the target can be done by summing the last 4 numbers
    numbers.sort(() => Math.random() - 0.5);  // Shuffle the list to avoid cheaters who just return the last 4 elements ;)
    runTestcase(numbers, target, `Large test #${i}`);
}

console.log('Congratulations. You passed all testcases!');
