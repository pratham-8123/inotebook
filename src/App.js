import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar.js';
import Home from './components/Home.js';
import About from './components/About.js';
import NoteState from './context/notes/NoteState.js';
import Alert from './components/Alert.js';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import { useState } from 'react';

function App() {
  const [alert, setAlert] = useState(null);
  const modifyAlert = (type, message) => {
    setAlert({ type: type, message: message });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home modifyAlert={modifyAlert} />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login modifyAlert={modifyAlert} />} />
              <Route exact path="/signup" element={<Signup modifyAlert={modifyAlert} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
