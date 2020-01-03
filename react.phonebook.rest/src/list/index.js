import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';

export default class List extends Component {

  edit = (item) =>{
    if(this.props.onEdit instanceof Function)
      this.props.onEdit(item);
  }

  delete = (item) =>{
    if(this.props.onDelete instanceof Function)
      this.props.onDelete( item );
  }

  render() {
    let list = this.props.data;
    return (
        <Table> 
          <thead>
              <tr>
                <th> Name </th>
                <th> Age </th>
                <th> Sex </th>
                <th> Phone </th>
                <th> Address </th>
                <th> Actions </th>
              </tr>
          </thead>
          <tbody>
              {
                list.map(item=>(
                  <tr key={item.id}>
                    <td> {item.firstname} {item.lastname} </td>
                    <td> {item.age} </td>
                    <td> {item.sex} </td>
                    <td> {item.phone} </td>
                    <td> {item.address} </td>
                    <td> 
                      <Button color="info" size="sm" onClick={()=>this.edit(item)}> Edit </Button>
                      <Button color="danger" size="sm" onClick={()=>this.delete(item)} > Delete </Button>
                    </td>
                  </tr>
                ))
              }
          </tbody>
        </Table>
    )
  }
}
