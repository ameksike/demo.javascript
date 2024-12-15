class SuperFastPersonSet {
    constructor(compareFields = ['name', 'email', 'age']) {
        this.compareFields = compareFields;
        this.uniqueMap = new Map();
    }

    // Optimized unique key generation
    getUid(person) {
        return this.compareFields
            .map(field => {
                const value = person[field];
                return typeof value === 'string'
                    ? value.toLowerCase().trim()
                    : value;
            })
            .join('|');
    }

    // Ultra-fast add method
    add(person) {
        const uniqueKey = this.getUid(person);

        if (!this.uniqueMap.has(uniqueKey)) {
            this.uniqueMap.set(uniqueKey, person);
        }
    }

    // Bulk add for maximum performance
    addMany(people) {
        for (const person of people) {
            this.add(person);
        }
    }

    // O(1) lookup
    has(person) {
        const uniqueKey = this.getUid(person);
        return this.uniqueMap.has(uniqueKey);
    }

    // Optimized array conversion
    toArray() {
        return Array.from(this.uniqueMap.values());
    }

    // Performance-optimized size getter
    get size() {
        return this.uniqueMap.size;
    }

    // Static method for one-time unique set creation
    static get(people, compareFields = ['name', 'email', 'age']) {
        const uniqueSet = new SuperFastPersonSet(compareFields);
        uniqueSet.addMany(people);
        return uniqueSet;
    }
}

// Performance benchmark
function performanceBenchmark() {
    // Generate large dataset
    const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
        name: `Person ${i}`,
        email: `person${i}@example.com`,
        age: Math.floor(Math.random() * 100),
        additionalData: `Some extra data ${Math.random()}`
    }));

    // Add some duplicates
    largeDataset.push(...largeDataset.slice(0, 1000));

    console.time('Unique Set Creation');
    const uniquePersonSet = SuperFastPersonSet.get(largeDataset);
    console.timeEnd('Unique Set Creation');

    console.log('Total unique people:', uniquePersonSet.size);
}

// Example usage
const people = [
    { name: 'John Doe', age: 30, email: 'john@example.com' },
    { name: 'John Doe', age: 30, email: 'john@example.com' }, // Duplicate
    { name: ' John Doe ', age: 30, email: 'JOHN@example.com' }, // Technically same person
    { name: 'Jane Smith', age: 25, email: 'jane@example.com' }
];

const uniquePersonSet = SuperFastPersonSet.get(people);
console.log('Unique People:', uniquePersonSet.toArray());

// Run performance benchmark
performanceBenchmark();