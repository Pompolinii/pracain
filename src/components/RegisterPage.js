import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const errorMessages = {
    email: 'Email',
    password: 'Hasło',
    UserName: 'Nazwa użytkownika',
    FullName: 'Imię i nazwisko',
    Address: 'Adres',
    DateOfBirth: 'Data urodzenia',
    DriverLicenseNumber: 'Prawo jazdy',
    general: 'Błąd ogólny',
};

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

    const [errors, setErrors] = useState({});
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
        setErrors({}); 
        try {
            const response = await fetch('https://localhost:7175/api/Account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                if (errorData.errors) {
                    
                    const translatedErrors = Object.entries(errorData.errors).reduce((acc, [field, messages]) => {
                        acc[errorMessages[field] || field] = messages;
                        return acc;
                    }, {});
                    setErrors(translatedErrors);
                } else {
                    
                    const errorMessage = await response.text();
                    setErrors({ general: [errorMessage || 'Wystąpił błąd podczas rejestracji.'] });
                }
                return;
            }
            
            navigate('/');
        } catch (error) {
            console.error('Błąd:', error);
            setErrors({ general: ['Wystąpił błąd podczas rejestracji.'] });
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
                    placeholder="Nazwa użytkownika"
                    value={user.UserName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="FullName"
                    placeholder="Imię i nazwisko"
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
                    type="date"
                    name="DateOfBirth"
                    placeholder="Data urodzenia"
                    value={user.DateOfBirth}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="DriverLicenseNumber"
                    placeholder="Prawo jazdy"
                    value={user.DriverLicenseNumber}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Zarejestruj się</button>
            </form>
            {Object.keys(errors).length > 0 && (
                <div style={styles.errorContainer}>
                    {Object.entries(errors).map(([field, messages]) => (
                        <div key={field}>
                            <strong>{field}:</strong>
                            <ul>
                                {messages.map((message, index) => (
                                    <li key={index} style={styles.error}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
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
    errorContainer: {
        marginTop: '10px',
    },
    error: {
        color: 'black',
        margin: '5px 0',
    },
};

export default RegisterPage;
