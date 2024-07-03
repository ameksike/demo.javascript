import React from 'react';

const componentMap: { [key: string]: React.LazyExoticComponent<React.FC> | null } = {
    // static cached
    CounterView: React.lazy(() => import('./CounterView')),
};

export const loadComponent = (componentName: string): React.LazyExoticComponent<React.ComponentType> | null => {
    if (!componentMap[componentName]) {
        componentMap[componentName] = React.lazy(() => import('./' + componentName));
    }
    console.log(componentName, componentMap[componentName]);
    return componentMap[componentName] || null;
};


export const loadComponentSafe = async (componentName: string): Promise<React.LazyExoticComponent<React.FC> | null> => {
    if (!componentMap[componentName]) {
        componentMap[componentName] = await load('./' + componentName);
    }
    console.log(componentName, componentMap[componentName]);
    return componentMap[componentName] || null;
};

export async function load(path: string): Promise<React.LazyExoticComponent<React.FC> | null> {
    try {
        if (componentMap[path]) {
            const component = await import('./' + path);
            return React.lazy(() => Promise.resolve(component));
        }
        return null;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error loading component at path ${path}:`, error.message);
        }
        return null;
    }
}