import * as React from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
let objects = [];
for (let i = 0; i < 26; i++) {
  let name = generateRandomName(i);
  let number = generateRandomNumber();
  objects.push({ name: name, number: number ,action:{edit : false , delete : false}});
}

function generateRandomName(i) {
  let names = ["Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Grace", "Henry", "Isabel", "Jack", "Kate", "Leo", "Mia", "Nathan", "Olivia", "Peter", "Quincy", "Rachel", "Samuel", "Tina", "Ursula", "Victoria", "William", "Xander", "Yvonne", "Zack"];
  let randomIndex = Math.floor(Math.random() * names.length);
  return names[i];
}

function generateRandomNumber() {
  return String(Math.floor(Math.random() * 10000000000));
}
export default function ReactVirtualizedTable() {
    objects.sort(function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    const [data,setData] = React.useState(objects);
    const [allData,resetData]=React.useState(objects);
    const [selectedUser,setSelectedUser] = React.useState();
    const [selectedUserIdx,setSelectedUserIdx] = useState();
    const [show, setShow] = useState(false);
    const [newShow,setNewShow] = useState(false);
    const [name , setName] = useState();
    const [number , setNumber] = useState();
    const [newName , setNewName] = useState(); 
    const [newNumber , setNewNumber] = useState();
    const [searchInput,setSearchInput] = useState();
    const handleClose = () => setShow(false);
    const handleClose2 = () => setNewShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (e) => {
      let str = e.target.value;
      setSearchInput(str.toLowerCase());
      if(!isNaN(str)){
        setData(objects.filter((contact) => contact.number.startsWith((str))))
      }
      else if(str !== "")
       setData(objects.filter((contact) => contact.name.toLowerCase().startsWith(str.toLowerCase())))
        else
        setData(allData);
    }
    const editUser = (user) => {
        console.log(user)
        const id = objects.findIndex((obj) => obj.number === user.number);
        setSelectedUser(user);
        setName(user.name);
        setNumber(user.number);
        setSelectedUserIdx(id);
        setShow(true);
    } 
    const ChangeName = (e,param) => {
        setName(e.target.value);
        console.log(e.target.value);
    }
    const ChangeNumber = (e,param) => {
        setNumber(e.target.value);
        console.log(e.target.value);
    }
    const Save = () => {
        let obs = {}
        obs.name = name;
        obs.number = number;

        objects[selectedUserIdx] = obs;
        if(searchInput !== undefined)
            setData(objects.filter((contact) => contact.name.toLowerCase().startsWith(searchInput)))
        else 
            setData(objects);
        console.log(objects[selectedUserIdx])
        setShow(false)
    }
    const Delete = (user) => {
        objects = objects.filter((obj) => obj.number !== user.number);
        setData(objects);
    }
    const Add = () => {
        setNewShow(true);
        setNewNumber("");
        setNewName("");
    }
    const ChangeNewName = (e) => {
        setNewName(e.target.value);
    }
    const ChangeNewNumber = (e) => {
        setNewNumber(e.target.value);
    }
    const SaveContact = () => {
        if(isNaN(String(newNumber)))
        {
           toast.error("Invalid Number"); 
           return;
        }
        if(newNumber && newNumber.length != 10)
        {
            toast.error("Number should have exactly 10 digits"); 
            return;
        }
        let obj = objects.filter((c) => c.name === newName);
        if(obj && obj.length > 0){
            toast.error("A contact with the same name Already exists");
            return;
        }
        const c = {
            name:newName,
            number:newNumber,
        }
        objects.push(c); 
        setData(objects);
        toast.success("Contact Successfully Added");
        setNewShow(false);
    }
  return (
    <div >
        <h1 style = {{textAlign:'center'}}>Contacts</h1>
    <Form.Control
    className='m-3'
    type="Text"
    placeholder="Search"
    autoFocus
    onChange={(e) => handleChange(e)}
    />
    <Button  className='m-3' onClick={Add}>Add a new Contact</Button>
    <TableVirtuoso
    className='m-4'
      style={{ height: 400}}
      data={data}
      fixedHeaderContent={() => (
        <tr>
          <th style={{ width: 300, background: 'white' }}>Name</th>
          <th style={{ width: 300,background: 'white' }}>Number</th>
          <th style={{ background: 'white' }}>Action</th>
        </tr>
      )}
      itemContent={(index, user) => (
        <>
          <td className='contact' style={{ width: 150 ,height:50}}>{user.name}</td>
          <td className='contact'>{user.number}</td>
          <td style={{ width: 150 ,height:50}}>      
            <Button className='m-2' variant="primary" onClick={() => editUser(user)}>
        Edit
      </Button><Button variant='danger' onClick={(e) => Delete(user)}>Delete</Button></td>
        </>

      )}
    />
    <div class = "edit-modal">
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Name"
                autoFocus
                value={name}
                onChange={(e) => ChangeName(e)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Number</Form.Label>
              <Form.Control type="text"  placeholder="Number" value={number}
              onChange={(e) => ChangeNumber(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={Save}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
      <div class="Add-modal">
      <Modal show={newShow} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Name"
                autoFocus
                value={newName}
                onChange={(e) => ChangeNewName(e)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Number</Form.Label>
              <Form.Control type="text"  placeholder="Number" value={newNumber}
              onChange={(e) => ChangeNewNumber(e)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={SaveContact}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
      </div>
    </div>
  );
}