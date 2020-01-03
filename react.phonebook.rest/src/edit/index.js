import React, { PureComponent } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class Edit extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
       model: { id: 0, firstname: "", lastname: "",  age: '', sex: '', address: '', phone: '' },
    };
  }

  setValue = (event, field) => {
    var item = this.state.model;
    item[field] = event instanceof Object ? event.target.value : event;
    this.setState({ 'model': item });
  }

  save = () => {
      /*let item = {
        id: parseInt(this.props.data.id),
        firstname: this.refs.firstname,
        lastname: this.refs.lastname,
        age: this.refs.age,
        sex: this.refs.sex,
        address: this.refs.address,
        phone: this.refs.phone,
      }*/
      let item = this.state.model.slice();
      item.id = parseInt(this.props.data.id);
      console.log(item);
      console.log('************************');  
      this.props.onSave(item);
  }

  render() {
    let model = this.props.data;
    return (
        <Form>
          <FormGroup>
            <div className="row">
              <div className="col-md-4">
                <Label for="firstname">Firstname:</Label>
                <Input id="firstname" type="text" placeholder="Person firstname ..." 
                  readOnly={false}  value={model.firstname}
                  onChange={ event => this.setValue(event, 'firstname') }
                />
              </div>
              <div className="col-md-8">
               <Label for="lastname">Lastname:</Label>
               <Input id="lastname" type="text" placeholder="Person lastname ..."  
                readOnly={false} value={model.lastname}  
                onChange={ event => this.setValue(event, 'lastname')}
                />
              </div>
            </div>
          </FormGroup>

          <FormGroup>
            <div className="row">
              <div className="col-md-6">
                <Label for="age">Age:</Label>
                <Input id="age" type="text" placeholder="Person age ..."  
                  readOnly={false} value={model.age}
                  onChange={ event => this.setValue(event, 'age')}
                />
              </div>
              <div className="col-md-6">
                <Label for="sex">Sex:</Label>
                <Input id="sex" type="text" placeholder="Person sex ..."  
                readOnly={false} value={model.sex}
                onChange={ event => this.setValue(event, 'sex')}
                />
              </div>
            </div>
          </FormGroup>
          
          <FormGroup>
              <Label for="phone">Phone:</Label>
              <Input id="phone" type="text" placeholder="Person phone ..."  
              readOnly={false} value={model.phone}
              onChange={ event => this.setValue(event, 'phone')}
              />
          </FormGroup>
          
          <FormGroup>
              <Label for="address">Address:</Label>
              <Input id="address" type="text" placeholder="Person address ..."  
              readOnly={false} value={model.address}
              onChange={ event => this.setValue(event, 'address')}
              />
          </FormGroup>

          <Button color="primary" block onClick={this.save} >Save</Button>
        </Form>
    ) 
  }
}
