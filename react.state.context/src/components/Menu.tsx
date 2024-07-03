import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import routes from '../models/Routes';

const Home = React.lazy(() => import('./PageHome'));
const About = React.lazy(() => import('./PageAbout'));
const User = React.lazy(() => import('./PageUser'));
import PageCmp from './PageCmp'
import RouteDynamic from './RouteDynamic';

export default function Menu() {

  return (
    <Router>
      <nav>
        <ul className='box box-align-between'>
          {routes.map(item => <li key={item.label}> <Link to={item.route}>{item.label}</Link> </li>)}
        </ul>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
          <Route path="/componets" element={<PageCmp />} />
          <Route path="/*" element={<RouteDynamic />} />
        </Routes>
      </Suspense>
    </Router>
  );
}