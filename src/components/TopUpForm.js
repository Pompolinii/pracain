import React, { useState, useEffect } from 'react';

const TopUpForm = ({setBalance, balance}) => {
  const [blikCode, setBlikCode] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetchBalance();
    
  }, [balance]);

  const fetchBalance = async (userId, token) => {
    try {
      const balanceResponse = await fetch(`https://localhost:7175/api/Account/${userId}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        console.log(balanceData);
        setBalance(balanceData.balance); // Uaktualnienie stanu balance
      } else {
        console.error('Błąd przy pobieraniu salda:', balanceResponse.statusText);
      }
    } catch (error) {
      console.error('Wystąpił błąd przy pobieraniu salda:', error);
    }
  };

  const handleTopUp = async (e) => {
    e.preventDefault(); // Zapobiega domyślnemu działaniu formularza

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Pobieranie userId z localStorage
  
      if (!userId) {
        throw new Error('Nie można znaleźć identyfikatora użytkownika');
      }
  
      const response = await fetch('https://localhost:7175/api/Rentals/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ blikCode, amount, userId }), // Przekazywanie blikCode i userId w body
      });
  
      if (!response.ok) throw new Error('Błąd doładowania');
  
      const data = await response.json();
      alert(`Doładowanie powiodło się! Twoje nowe saldo to: ${data.newBalance} PLN`);
      await fetchBalance(userId, token);
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas doładowania BLIK.');
    }
  };

  return (
    <form onSubmit={handleTopUp} style={styles.form}>
      <div>
        <label>BLIK Code:</label>
        <input
          type="text"
          value={blikCode}
          onChange={(e) => setBlikCode(e.target.value)}
          style={styles.input}
          required
        />
      </div>
      <div>
        <label>Kwota:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          style={styles.input}
          required
        />
      </div>
      <button type="submit" style={styles.button}>Doładuj</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
    margin: '0 auto',
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
};

export default TopUpForm;
