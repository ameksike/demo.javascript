
import React from 'react';
import logo from './img/logo.svg';
import './index.css';

const Header = ({title}) => (
    <div className="row">
        <header className="App-header">
            <h2>{title ? title : 'Set title params'}</h2>
            <img src={logo} className="App-logo" alt="logo" />
        </header>
    </div>
);

export default Header;
