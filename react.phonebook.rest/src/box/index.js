import React, { PureComponent } from 'react';
import { Alert } from 'reactstrap';
import List from '../list';
import Edit from '../edit';

export default class Box extends PureComponent {
  url;
  state;
  reqInf;
  constructor(props){
    super(props);
    this.url = "http://localhost:8000/phonebook";
    this.state = {
      'selected': { id: 0, firstname: "", lastname: "",  age: '', sex: '', address: '', phone: '' },
      'message': { text: '', style: 'info' },
      'data': [ ]
    };
    this.reqInf = {
      headers: new Headers({
        'Content-type': 'application/json',
        'sec-fetch-mode': 'no-cors',
        'Access-Control-Allow-Origin': 'true'
      })
    };
  }

  saveItem = (item)=>{
      console.log('----------------------------------- BOX::saveItem');
      console.log(item);

      let list = this.state.data;

      if(item.id === 0){
        item.id = list.length;
        list.push(item);
      }else{
          let index = list.findIndex( i => i.id === item.id);
          list[index] = item;
      }

      this.setState({ 
        'data': list, 
        'selected': { id: 0, firstname: "", lastname: "",  age: '', sex: '', address: '', phone: '' },
        'message': { 
          text:'add new person', 
          style: 'success' 
        } 
      });

/*
      const requestInfo = {
        method: item.id === 0 ? "POST" : "PUT",
        body: JSON.stringify(item),
        headers: this.reqInf
      };
      fetch(this.url, requestInfo)
        .then(response => response.json())
        .then(varItem => {
          if(item.id === 0){
              data.push(varItem);
          }else{
              let index = data.findIndex( i => i.id === item.id);
              data[index] = varItem;
          }
          this.setState({ data });
        })
        .catch(error => console.log(error))
      ;
*/
  }

  deleteItem = (item)=>{
    console.log('----------------------------------- BOX::deleteItem');
    let list = this.state.data;
    let index = list.findIndex( i => i.id === item.id);
    list.splice(index, 1);
    this.setState({ 
      'data':list, 
      'selected': { id: 0, firstname: "", lastname: "",  age: '', sex: '', address: '', phone: '' },
      'message': { text:'delete data', style: 'danger' } 
    });

/*
    fetch(this.url + "/" + item.id, { method: 'DELETE'})
      .then(response => response.json())
      .then(newItem => console.log(newItem))
      .catch(error => console.log(error))
    ;
*/
  }

  editItem = (item)=>{
    console.log('----------------------------------- BOX::editItem');
    console.log(item);
    
    let list = this.state.data;
    this.setState({ 
      data: list, 
      selected: item,
      message: { text:'update data', style: 'info' } 
    });
  }

  componentDidMount(){
    var list = [
      {"id":1,"firstname":"Dr Nice","lastname":"Mike","age":12,"sex":"M","address":"Lincon Street","phone":"85668899","avatar":"./assets/person/img2-small.jpg","pass":"","user":null},
      {"id":2,"firstname":"Narco","lastname":"Mus Iliniscato ","age":25,"sex":"M","address":"Lincon Street","phone":"22668899","avatar":"./assets/person/img4-small.jpg","pass":null,"user":null},
      {"id":3,"firstname":"Tornado","lastname":"Izquierdo Derecho","age":56,"sex":"M","address":"Lincon Street","phone":"52668899","avatar":"./assets/person/img2-small.jpg","pass":null,"user":null},
      {"id":4,"firstname":"Magma","lastname":"Tusca Perez","age":15,"sex":"M","address":"Lincon Street","phone":"45668899","avatar":"./assets/person/img3-small.jpg","pass":"64sfsadf2as3df13asdf","user":"magma.mangrino"},
      {"id":5,"firstname":"Dr IQ","lastname":"Ruso Chino","age":89,"sex":"M","address":"Lincon Street","phone":"24668899","avatar":"./assets/person/img5-small.jpg","pass":null,"user":null},
      {"id":6,"firstname":"Dynama","lastname":"War Pess","age":7,"sex":"F","address":"Lincon Street","phone":"67668811","avatar":"./assets/person/img2-small.jpg","pass":null,"user":null}
    ];

    this.setState({ data: list, message: { text:'load data', style: 'info' } });
    console.log('----------------------------------- BOX::componentDidMount');
/*
    fetch(this.url, this.reqInf)
      .then( response => response.json() )
      .then( result => {

        console.log(result);
        //this.setState({ 'data': result.data});
      })
      .then( error => console.log(error) )
    ;
*/
  }

  render() {
    return (
      <div style={{marginTop:'5px'}}>
        <div style={{width:'100%'}}>
          {
            this.state.message.text !== '' ?  <Alert color={this.state.message.style} >{this.state.message.text}</Alert>: ''
          }
        </div>  
        <div className="row">
            <div className="col-md-6" >
                <h2 className="font-weight-blod text-center">Form Phonebook</h2>
                <Edit data={this.state.selected} onSave={this.saveItem} />
            </div>
            <div className="col-md-6" >
                <h2 className="font-weight-blod text-center">List Phonebook</h2>
                <List data={this.state.data} onDelete={this.deleteItem} onEdit={this.editItem} />
            </div>
        </div>
      </div>
    )
  }
}
