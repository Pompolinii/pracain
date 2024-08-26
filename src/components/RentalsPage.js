import React, { useEffect, useState } from 'react';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  
  const fetchRentals = async () => {
    try {
      const response = await fetch(`https://localhost:7175/api/rentals/user/${localStorage.getItem('userId')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Błąd pobierania wypożyczeń');

      const data = await response.json();
      setRentals(data);
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleReturnCar = async (carId) => {
    try {
      const response = await fetch('https://localhost:7175/api/rentals/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ carId, userId: localStorage.getItem('userId') }),
      });

      if (!response.ok) throw new Error('Błąd zwrotu auta');

      fetchRentals(); // Odswieżenie listy wypożyczeń
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  return (
    <div>
      <h2>Twoje wypożyczenia</h2>
      {rentals.length === 0 ? (
        <p>Brak wypożyczonych aut.</p>
      ) : (
        <ul>
          {rentals.map((rental) => (
            <li key={rental.car.id}>
              <img src={`https://localhost:7175${rental.car.imagePath}`} alt={`${rental.car.marka} ${rental.car.model}`} style={styles.image} />
              <h3>{rental.car.marka} {rental.car.model}</h3>
              <p>Rok: {rental.car.year}</p>
              <button onClick={() => handleReturnCar(rental.car.id)} style={{...styles.button,...styles.rentButton}}>Zwróć</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: '8px 16px',
    fontSize: '16px', // Ustawienie tej samej wielkości czcionki dla wszystkich przycisków
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '150px', // Ustawienie tej samej szerokości dla wszystkich przycisków
    height: '40px', // Ustawienie tej samej wysokości dla wszystkich przycisków
  },
  rentButton: {
    backgroundColor: '#007bff', // Kolor dla przycisku "Wypożycz"
    color: '#fff',
  },


  image: {
    width: '300px',
    height: 'auto',
    marginRight: '10px',
  },

};

export default RentalsPage;
