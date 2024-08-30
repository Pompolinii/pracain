import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_nlrlnvy', // 
      'template_gffu0xj', // 
      {
        from_name: formData.name, 
        from_email: formData.email, 
        message: formData.message, 
      },
      '1TTFbGdLBr-tcNMG3' // 
    )
    .then((result) => {
      alert('Wiadomość została wysłana!');
    }, (error) => {
      console.error('Błąd wysyłania wiadomości:', error.text);
    });

    setFormData({ name: '', email: '', message: '' }); 
  };

  return (
    <div style={styles.container}>
      <h2>Skontaktuj się z nami</h2>
      <form onSubmit={sendEmail} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Twoje imię"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Twój e-mail"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="message"
          placeholder="Wiadomość"
          value={formData.message}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Wyślij</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '150px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ContactUs;
