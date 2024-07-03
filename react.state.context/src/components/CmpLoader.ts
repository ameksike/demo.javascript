import React from 'react';

const componentMap: { [key: string]: React.LazyExoticComponent<React.FC> } = {
    CounterView: React.lazy(() => import('./CounterView')),
};

export const loadComponent = (componentName: string): React.LazyExoticComponent<React.ComponentType> | null => {
    if(!componentMap[componentName]) {
        componentMap[componentName] = React.lazy(() => import('./' + componentName));
    }
    return componentMap[componentName] || null;
};