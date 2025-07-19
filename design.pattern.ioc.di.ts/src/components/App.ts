/**
 * App component with Awilix-compatible implicit dependency injection
 * 
 * This class demonstrates Awilix's native implicit dependency injection pattern.
 * Awilix requires destructuring in constructors for implicit dependency injection.
 * The constructor parameter uses destructuring { greeter } which will be automatically 
 * resolved to the 'greeter' service registered in the IoC container.
 */
export class App {
    private greeter: any;

    constructor(dependencies: { greeter: any }) {
        this.greeter = dependencies.greeter;
    }

    run(): void {
        // Call the greet method on the injected greeter service
        const greeting = this.greeter?.greet('✅ Native Awilix Dependency management');
        console.log(greeting);
    }
} 