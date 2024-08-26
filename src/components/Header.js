import React, { useState } from 'react';
import { useNavigate, Link , useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, setIsLoggedIn, setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Błąd dekodowania tokenu:', e);
      return null;
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7175/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        const decodedToken = parseJwt(data.token);
        const userId = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        if (userId) {
          localStorage.setItem('userId', userId);
        }
        const userRole = JSON.parse(atob(data.token.split('.')[1])).role; 
        setIsAdmin(userRole === 'Admin');
        setLoginMessage('Zalogowano pomyślnie!');
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setLoginMessage('Nieprawidłowe dane logowania.');
      }
    } catch (error) {
      setLoginMessage('Wystąpił błąd podczas logowania.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setLoginMessage('Wylogowano pomyślnie.');
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <h1>Moje Auto</h1>
      {isLoggedIn ? (
        <div>
          <Link to="/rentals" style={styles.link}>
            <button style={styles.button2}>Moje wypożyczenia</button>
          </Link>
          <Link to="/contact" style={styles.link}>
          <button style={styles.button2}>Kontakt</button>
        </Link>
          <button onClick={handleLogout} style={styles.button2}>Wyloguj</button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button2}>Zaloguj</button>
          </form>
          <Link to="/register" style={styles.link}>
            <button style={styles.button}>Zarejestruj się</button>
          </Link>
        </div>
      )}
      {location.pathname !== '/' && (
            <Link to="/" style={styles.link}>
              <button style={styles.button2}>Strona główna</button>
            </Link>
          )}
  {loginMessage && (
        <p style={loginMessage.includes('Nieprawidłowe') ? styles.errorMessage : styles.successMessage}>
          {loginMessage}
        </p>
      )}
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#282c34',
    color: '#fff',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
 button2:{
   padding: '8px 16px',
    backgroundColor: '#007bff', 
    alignItems: 'center',
    color: '#fff',
 },

  link: {
    textDecoration: 'none',
    marginLeft: '10px',
  },
  successMessage: {
    color: '#28a745', 
    backgroundColor: '#d4edda',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0',
  },
  errorMessage: {
    color: '#ff0000', 
    backgroundColor: 'black',
    padding: '10px',
    borderRadius: '4px',
    margin: '10px 0',
  },
};

export default Header;
