import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';

class App extends Component{  
  list;

  constructor(props){
    super(props);
    this.state = {
      title: "Simple Phonebook React Aplications",
      action: 0,
      index: '',
      data: [
        { name: 'Marion Mustosha', phone: '52146468', address: 'Lincon street'},
        { name: 'Murcia Mustosha', phone: '89146468', address: 'Mason street'},
        { name: 'Lucia Mousoliny', phone: '98146468', address: 'Misoury street'},
        { name: 'Fiasgo Pathronal', phone: '59146468', address: 'Monaco street'},
      ]
    };
  }

  render(){
    let mylist = this.state.data;
    return (
      <div className="App">
        
        <header className="App-header">
            <h2>{this.state.title}</h2>
            <img src={logo} className="App-logo" alt="logo" />
        </header>

        <form ref="frmMain" className="frmMain">
          <input type="text" ref="name" placeholder="Person Firstname and Lastname" className="frmField"/>
          <input type="text" ref="phone" placeholder="Person Phone Number" className="frmField"/>
          <input type="text" ref="address" placeholder="Person Address Details" className="frmField"/>
          <button onClick={this.onsave} className="btnMain">Save</button>
        </form>

        <div className="list">
          <ul>
            {mylist.map((obj, i)=>{
              return(
                  <li key={i} className="listMain">
                    <button onClick={(event)=>{this.onremove(i)}} className="listBtn">remove</button>
                    <button onClick={(event)=>{this.onedit(i)}} className="listBtn">edit</button>
                    <span> {i+1} - <b>{obj.name}</b>, {obj.phone}, {obj.address} </span> 
                  </li>  
              ) 
            })}
          </ul>
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.frmClear();
  }

  frmClear(){
    this.refs.frmMain.reset();
    this.refs.name.focus();
  }

  onsave = (event) => {
    event.preventDefault();
    let list = this.state.data;
    let name = this.refs.name.value;
    let address = this.refs.address.value;
    let phone = this.refs.phone.value;

    if(this.state.action === 0){ //...   new 
      list.push({ name, phone, address });
    }
    else{ //...   update 
      let index = this.state.index;
      list[index].name = name;
      list[index].phone = phone;
      list[index].address = address;
    }
    
    this.setState({ 'data': list, 'action':0 });
    this.frmClear();
  }

  onedit = (i) => {
    this.frmClear();
    let obj = this.state.data[i];
    this.refs.name.value = obj.name;
    this.refs.address.value = obj.address;
    this.refs.phone.value = obj.phone;
    this.setState({ 'action':1, 'index':i  });
  }

  onremove = (i) => {
    let list = this.state.data;
    list.splice(i, 1);
    this.setState({ 'data': list });
    this.frmClear();
  }
}

export default App;

/*
    
    
*/