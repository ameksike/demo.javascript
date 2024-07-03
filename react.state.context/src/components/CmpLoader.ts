import React from 'react';

const componentMap: { [key: string]: React.LazyExoticComponent<React.FC> } = {
    CounterAct: React.lazy(() => import('./CounterAct')),
    CounterView: React.lazy(() => import('./CounterView')),
};

export const loadComponent = (componentName: string): React.LazyExoticComponent<React.ComponentType> | null => {
    return componentMap[componentName] || null;
};
