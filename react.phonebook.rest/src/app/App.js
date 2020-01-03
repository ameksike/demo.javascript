import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from '../header';
import Box from '../box';

class App extends Component{  
  list;

  // eslint-disable-next-line no-useless-constructor
  constructor(props){
    super(props);
    this.state = {
      title: "Phonebook REST React Aplications"
    }
  }

  render(){
    return (
      <div className="container">
          <Header title={this.state.title} />
          <Box />
      </div>
    );
  }

}

export default App;
