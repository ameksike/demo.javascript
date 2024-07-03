import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Home = React.lazy(() => import('./PageHome'));
const About = React.lazy(() => import('./PageAbout'));
const User = React.lazy(() => import('./PageUser'));

export default function Menu() {
  return (
    <Router>
      <nav>
        <ul className='box box-align-between'>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
        </ul>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Suspense>
    </Router>
  );
}