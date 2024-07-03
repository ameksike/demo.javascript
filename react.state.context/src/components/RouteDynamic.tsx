import React, { Suspense, useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadComponentSafe } from './CmpLoader';
import { routeList } from '../models/Routes';
import ErrorBoundary from './ErrorBoundary';

const RouteDynamic: React.FC = () => {
    const location = useLocation();

    if (!routeList.has(location.pathname)) {
        console.log("NOT EXIST:", location.pathname, routeList)
    } else {
        console.log("EXIST:", location.pathname, routeList)
    }

    const [Component, setComponent] = useState<React.LazyExoticComponent<React.ComponentType> | null>(null);

    useEffect(() => {
      (async () => {
        const loadedComponent = await loadComponentSafe(location.pathname);
        setComponent(loadedComponent);
      })();
    }, [location.pathname]);

    if (!Component) {
        return <Navigate to="/" />;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <Component />
            </Suspense>
        </ErrorBoundary>
    );
};

export default RouteDynamic;