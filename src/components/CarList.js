import React, { useEffect, useState } from 'react';



const CarList = ({ isAdmin, isLoggedIn }) => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    marka: '',
  model: '',
  minYear: '',
  maxYear: '',
  transmission: '',
  minEngineSize: '',
  maxEngineSize: '',
  minPrice: '',
  maxPrice: '',
  });

  const [newCar, setNewCar] = useState({
    marka: '',
    model: '',
    year: '',
    isRented: false,
    ImagePath: null,
    transmission: '',
    enginesize: '',
    price: '',
  });

  const [editingCar, setEditingCar] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.marka) queryParams.append('marka', filters.marka);
    if (filters.model) queryParams.append('model', filters.model);
    if (filters.minYear) queryParams.append('minYear', filters.minYear);
    if (filters.maxYear) queryParams.append('maxYear', filters.maxYear);
    if (filters.transmission) queryParams.append('transmission', filters.transmission);
    if (filters.minEngineSize) queryParams.append('minEngineSize', filters.minEngineSize);
    if (filters.maxEngineSize) queryParams.append('maxEngineSize', filters.maxEngineSize);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await fetch(`https://localhost:7175/api/cars/search-cars?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Błąd pobierania aut');

      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error('Błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (editingCar) {
      setEditingCar({ ...editingCar, ImagePath: file });
    } else {
      setNewCar({ ...newCar, ImagePath: file });
    }
  };

  const handleAddCar = async () => {
    if (!isAdmin) return;

    const formData = new FormData(); // Tworzymy instancję FormData
    formData.append('marka', newCar.marka);
    formData.append('model', newCar.model);
    formData.append('year', newCar.year);
    formData.append('transmission', newCar.transmission);
    formData.append('enginesize', newCar.enginesize.replace('.', ','));
    formData.append('price', newCar.price);
    if (newCar.ImagePath) {
      formData.append('ImagePath', newCar.ImagePath); // Dodajemy plik obrazu do FormData
    }

    try {
      const response = await fetch('https://localhost:7175/api/cars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Błąd dodawania auta');

      setNewCar({ marka: '', model: '', year: '', isRented: false, ImagePath: null, transmission: '', enginesize: '', price: '' });
      fetchCars();
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`https://localhost:7175/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Błąd usuwania auta');

      fetchCars();
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const handleEditCar = (car) => {
    setEditingCar({ ...car });
  };

  const handleUpdateCar = async () => {
    if (!isAdmin || !editingCar) return;

    const formData = new FormData();
    formData.append('marka', editingCar.marka);
    formData.append('model', editingCar.model);
    formData.append('year', editingCar.year);
    formData.append('transmission', editingCar.transmission);
    formData.append('enginesize', String(editingCar.enginesize).replace('.', ','));
    formData.append('price', editingCar.price);
    if (editingCar.ImagePath instanceof File) {
      formData.append('ImagePath', editingCar.ImagePath);
    }

    try {
      const response = await fetch(`https://localhost:7175/api/cars/${editingCar.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Błąd edytowania auta');

      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const handleRentCar = async (carId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const rentalsResponse = await fetch(`https://localhost:7175/api/rentals/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!rentalsResponse.ok) throw new Error('Błąd pobierania danych wypożyczeń');

      const rentalsData = await rentalsResponse.json();
      if (rentalsData.length >= 2) {
        alert('Nie możesz wypożyczyć więcej niż dwóch samochodów.');
        return;
      }

      const response = await fetch('https://localhost:7175/api/rentals/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ carId, userId }),
      });

      if (!response.ok) throw new Error('Błąd wypożyczania auta');

      fetchCars();
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas wypożyczania samochodu. Sprawdź konsolę, aby uzyskać więcej informacji.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Lista dostępnych aut</h2>
      <form onSubmit={handleFilterSubmit} style={styles.form}>
        <input
          type="text"
          name="marka"
          placeholder="Marka"
          value={filters.marka}
          onChange={(e) => setFilters({ ...filters, marka: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={filters.model}
          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          name="minYear"
          placeholder="Min. Rok"
          value={filters.minYear}
          onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          name="maxYear"
          placeholder="Max. Rok"
          value={filters.maxYear}
          onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          name="transmission"
          placeholder="skrzynia biegów"
          value={filters.transmission}
          onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          name="minEngineSize"
          placeholder="pojemność silnika min"
          step="0.1"
          value={filters.minEngineSize}
          onChange={(e) => setFilters({ ...filters, minEngineSize: e.target.value })}
          style={styles.input}
        />
 <input
          type="number"
          name="maxEngineSize"
          placeholder="pojemność silnika max"
          step="0.1"
          value={filters.maxEngineSize}
          onChange={(e) => setFilters({ ...filters, maxEngineSize: e.target.value })}
          style={styles.input}
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Cena min"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Cena maks"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={styles.input}
        />

        <button type="submit" style={{ ...styles.button, ...styles.rentButton }}>Filtruj</button>
      </form>

      {isAdmin && (
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Marka"
            value={newCar.marka}
            onChange={(e) => setNewCar({ ...newCar, marka: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Rok"
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
            style={styles.input}
          />
          <input type="file" onChange={handleImageChange} style={styles.input} />
          <input
            type="text"
            name="transmission"
            placeholder="skrzynia biegów"
            value={newCar.transmission}
            onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            name="enginesize"
            placeholder="pojemność silnika"
            step="0.1"
            value={newCar.enginesize}
            onChange={(e) => setNewCar({ ...newCar, enginesize: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            name="price"
            placeholder="Cena"
            value={newCar.price}
            onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleAddCar} style={{ ...styles.button, ...styles.rentButton }}>Dodaj auto</button>
        </div>
      )}

      {editingCar && (
        <div style={styles.form}>
          <h3>Edytuj auto:</h3>
          <input
            type="text"
            placeholder="Marka"
            value={editingCar.marka}
            onChange={(e) => setEditingCar({ ...editingCar, marka: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Model"
            value={editingCar.model}
            onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Rok"
            value={editingCar.year}
            onChange={(e) => setEditingCar({ ...editingCar, year: e.target.value })}
            style={styles.input}
          />
          <input type="file" onChange={handleImageChange} style={styles.input} />
          <input
            type="text"
            name="transmission"
            placeholder="skrzynia biegów"
            value={editingCar.transmission}
            onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            name="enginesize"
            placeholder="pojemność silnika"
            step="0.1"
            value={editingCar.enginesize}
            onChange={(e) => setEditingCar({ ...editingCar, enginesize: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            name="price"
            placeholder="Cena"
            value={editingCar.price}
            onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleUpdateCar} style={{ ...styles.button, ...styles.rentButton }}>Zaktualizuj auto</button>
          <button onClick={() => setEditingCar(null)} style={{ ...styles.button, ...styles.rentButton }}>Anuluj</button>
        </div>
      )}

      {loading ? (
        <p>Ładowanie...</p>
      ) : cars.length === 0 ? (
        <p>Brak dostępnych aut.</p>
      ) : (
        <ul style={styles.list}>
          {cars.map((car) => (
            <li key={car.id} style={styles.listItem}>
              <img src={`https://localhost:7175${car.imagePath}`} alt={`${car.marka} ${car.model}`} style={styles.image} />
              <h3>{car.marka} {car.model} Rok: {car.year}</h3>
              <p>Rok: {car.year}</p> <p>Skrzynia: {car.transmission} Pojemność silnika: {car.enginesize}L Cena: {car.price} PLN</p>
            
              {car.isRented && isLoggedIn && <p style={styles.rentedText}>Auto wypożyczone</p>} {/* Tekst "Auto wypożyczone" */}
              {isAdmin && (
                <>
                  <button onClick={() => handleEditCar(car)} style={{ ...styles.button, ...styles.editButton }}>Edytuj</button>
                  <button onClick={() => handleDeleteCar(car.id)} style={{ ...styles.button, ...styles.deleteButton }}>Usuń</button>
                </>
              )}
              {isLoggedIn && !car.isRented && (
                <button onClick={() => handleRentCar(car.id)} style={{ ...styles.button, ...styles.rentButton }}>Wypożycz</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  form: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '150px',
    height: '40px',
  },
  rentButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    color: '#fff',
  },

  list: {
    listStyleType: 'none',
    padding: 0,
    background: 'transparent'
  },
  listItem: {
    backgroundColor: 'rgba(244, 244, 244, 0.8)',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
  },
  image: {
    width: '300px',
    height: 'auto',
    marginRight: '10px',
  },
  rentedText: {
    color: '#ff6347',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  container: {
    padding: '20px',
    background: 'transparent',
  },
};

export default CarList;