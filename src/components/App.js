import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import api from "../api/contacts";
import Header from './Header';
import AddContact from './AddContact';
import EditContact from './EditContact';
import ContactList from './ContactList/ContactList';
import ContactDetail from './ContactDetail';


function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm,setSearchTerm]=useState("");
  const [searchResults,setSearchResults]=useState([""]);

  // retreiveContacts
  const retreiveContacts = async () => {
    const response = await api.get("/contacts");
    return response.data;
  };
  const random = () => {
    return Math.random();
  }

  const addContactHandler = async (contact) => {
    //  setContacts([...contacts, contact]);
    const request = {
      id: random(),
      ...contact,
    }

    const response = await api.post("/contacts", request)
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/contacts/${contact.id}`, contact);
    const { id } = response.data;
      setContacts(contacts.map(contact => {
      return contact.id === id ? { ...response.data,  } : contact;
    }));
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/contacts/${id}`)
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });
    setContacts(newContactList);
  }
  const searchHandler=(searchTerm)=>{
   setSearchTerm(searchTerm);
   if(searchTerm!==""){
   const newContactList=contacts.filter((contact)=>{
    return Object.values(contact)
    .join("")
    .toLowerCase()
    .includes(searchTerm.toLowerCase);
  //  return;
   })
   setSearchResults(newContactList);
   }else{
   setSearchResults(contacts);
   }
  };

  useEffect(() => {
    // const retrieveContacts = JSON.parse(localStorage.getItem("contacts"))
    // if (retrieveContacts) {
    //   setContacts(retrieveContacts);
    const getAllContacts = async () => {
      const allContacts = await retreiveContacts();
      if (allContacts) setContacts(allContacts);
    };
    getAllContacts();
  }, []);

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      //   localStorage.setItem("contacts", JSON.stringify(contacts));
    }

  }, [contacts]);

  return (
    <div className="ui container">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/add" element={<AddContact addContactHandler={addContactHandler} />} />
          <Route path="/edit" element={<EditContact updateContactHandler={updateContactHandler} />} />
          <Route path="/" element={<ContactList contacts={ searchTerm.length <1 ? contacts : searchResults} getContactId={removeContactHandler} />} 
          term={searchTerm}
          searchKeyword={searchHandler}/>
          <Route path="/contact/:id" element={<ContactDetail />} />
        </Routes>

      </BrowserRouter>
      {/* <AddContact addContactHandler={addContactHandler} />
      <ContactList contacts={contacts} deleteContactHandler={removeContactHandler} />  */}
    </div>
  )

};

export default App;
