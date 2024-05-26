import React from 'react';
import { BrowserRouter as Router, Routes, Route } from  'react-router-dom';
import './App.css'
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={ <LoginPage/> }/>
        <Route path="/" element={ <MainPage/> }/>
      </Routes>
    </Router>
  )
}

export default App
