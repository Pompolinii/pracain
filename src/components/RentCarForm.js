import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RentCarForm = ({ onSubmit }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ startDate, endDate });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div>
        <label>Data rozpoczęcia:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={new Date()}
          style={styles.input}
        />
      </div>
      <div>
        <label>Data zakończenia:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          minDate={startDate}
          style={styles.input}
        />
      </div>
      <button type="submit" style={styles.button}>Wypożycz</button>
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

export default RentCarForm;