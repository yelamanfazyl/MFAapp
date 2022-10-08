import {React, useState} from 'react';
import './App.css';
import MainPage from '../Main/MainPage';
import RegistrationPage from '../RegistrationPage/RegistrationPage';
import LoginPage from '../LoginPage/LoginPage';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  const [email, setEmail] = useState("")

  function changeEmail(new_email) {
    console.log(new_email);
    setEmail(new_email);
  }

  return (
    <Router className="App">
      <Routes>
        <Route exact path='/' element={<MainPage email={email} />} />
        <Route exact path='/registration' element={<RegistrationPage />} />
        <Route exact path='/login' element={<LoginPage changeEmail={email => changeEmail(email)} />} />
      </Routes>
    </ Router>
  );
}

export default App;
