import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ChatPage from '../src/pages/ChatPage';
import HomePage from '../src/pages/HomePage'
import './App.css';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
     <Route exact path='/chats' element={<ChatPage/>}></Route>
     <Route exact path='/' element={<HomePage/>}></Route>
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
