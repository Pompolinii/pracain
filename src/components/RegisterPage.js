import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
        UserName: '',
        FullName: '',
        Address: '',
        DateOfBirth: '',
        DriverLicenseNumber: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://localhost:7175/api/Account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Błąd rejestracji, sprawdź dane i spróbuj ponownie.');
            }

            // Jeśli rejestracja zakończyła się sukcesem, przekieruj na stronę główną
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Zarejestruj się</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={user.password}
                    onChange={handleInputChange}
                    style={styles.input}
                />

                <input
                    type="text"
                    name="UserName"
                    placeholder="nazwa użytkownika"
                    value={user.UserName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="FullName"
                    placeholder="Imię i Nazwisko"
                    value={user.FullName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="Address"
                    placeholder="Adres"
                    value={user.Address}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="data"
                    name="DateOfBirth"
                    placeholder="Data Urodzenia"
                    value={user.DateOfBirth}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="number"
                    name="DriverLicenseNumber"
                    placeholder="Prawo Jazdy"
                    value={user.DriverLicenseNumber}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Zarejestruj się</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '400px',
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
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'green',
        marginTop: '10px',
    },

};

export default RegisterPage;