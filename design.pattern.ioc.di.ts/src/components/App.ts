import { Greeter } from "./Greeter";

export class App {
    constructor(private greeter: Greeter) { }

    run(): void {
        const greeting = this.greeter.greet('Awilix');
        console.log(greeting);
    }
} 