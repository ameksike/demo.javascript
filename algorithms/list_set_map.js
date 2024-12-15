class SuperFastSet {
    constructor(compareFields = ['name', 'email', 'age']) {
        this.compareFields = compareFields;
        this.uniqueMap = new Map();
    }

    // Optimized unique key generation
    getUid(item) {
        return this.compareFields
            .map(field => {
                const value = item[field];
                return typeof value === 'string'
                    ? value.toLowerCase().trim()
                    : value;
            })
            .join('|');
    }

    // Ultra-fast add method
    add(item) {
        const uniqueKey = this.getUid(item);

        if (!this.uniqueMap.has(uniqueKey)) {
            this.uniqueMap.set(uniqueKey, item);
        }
    }

    // Bulk add for maximum performance
    addMany(list) {
        for (const item of list) {
            this.add(item);
        }
        return this;
    }

    // O(1) lookup
    has(item) {
        const uniqueKey = this.getUid(item);
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
    static get(list, compareFields = ['name', 'email', 'age']) {
        const uniqueSet = new SuperFastSet(compareFields);
        uniqueSet.addMany(list);
        return uniqueSet;
    }
}

// Performance benchmark
function performanceBenchmark() {
    // Generate large dataset
    const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
        name: `item ${i}`,
        email: `item${i}@example.com`,
        age: Math.floor(Math.random() * 100),
        additionalData: `Some extra data ${Math.random()}`
    }));

    // Add some duplicates
    largeDataset.push(...largeDataset.slice(0, 1000));

    console.time('Unique Set Creation');
    const uniqueItemSet = SuperFastSet.get(largeDataset);
    console.timeEnd('Unique Set Creation');

    console.log('Total unique list:', uniqueItemSet.size);
}

// Example usage
const list = [
    { name: 'John Doe', age: 30, email: 'john@example.com' },
    { name: 'John Doe', age: 30, email: 'john@example.com' }, // Duplicate
    { name: ' John Doe ', age: 30, email: 'JOHN@example.com' }, // Technically same item
    { name: 'Jane Smith', age: 25, email: 'jane@example.com' }
];

const uniqueItemSet = SuperFastSet.get(list);
console.log('Unique list:', uniqueItemSet.toArray());

// Run performance benchmark
performanceBenchmark();