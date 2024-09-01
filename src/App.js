import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import CarList from './components/CarList';
import RegisterPage from './components/RegisterPage.js';
import RentalsPage from './components/RentalsPage';
import ContactUs from './components/ContactUs.js';
import TopUpForm from './components/TopUpForm.js';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      setIsAdmin(userRole === 'Admin');
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} balance={balance} setBalance={setBalance} />
        <Routes>
          <Route path="/" element={<CarList isAdmin={isAdmin} isLoggedIn={isLoggedIn} balance={balance} setBalance={setBalance} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/TopUp" element={<TopUpForm   balance={balance} setBalance={setBalance} />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
