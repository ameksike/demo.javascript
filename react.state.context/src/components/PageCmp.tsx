import { Suspense, useState } from "react";
import { loadComponent } from "./CmpLoader";

export default function PageCmp() {
    const [components, setComponents] = useState<string[]>([]);

    const addComponent = (componentName: string) => {
        setComponents(prevComponents => [...prevComponents, componentName]);
    };

    const removeComponent = (componentName: string) => {
        setComponents(prevComponents => prevComponents.filter(c => c !== componentName));
    };

    return (
        <div>
            <h3> Dynamic Component Manager </h3>

            <div className="box box-align-between">
                <div className="box box-vertical">
                    <button onClick={() => addComponent('CounterAct')}>Add CounterAct</button>
                    <button onClick={() => removeComponent('CounterAct')}>Remove CounterAct</button>
                </div>
                <div className="box box-vertical">
                    <button onClick={() => addComponent('CounterView')}>Add CounterView</button>
                    <button onClick={() => removeComponent('CounterView')}>Remove CounterView</button>
                </div>
            </div>

            <div>
                {components.map((componentName, index) => {
                    const Component = loadComponent(componentName);
                    return (
                        <Suspense fallback={<div>Loading...</div>} key={index}>
                            {Component && <Component />}
                        </Suspense>
                    );
                })}
            </div>
        </div>
    );
}
