import React, { useEffect, useState } from 'react';
import { loadScript } from '@paypal/paypal-js';

const TopUpForm = ({ setBalance, balance }) => {
  const [amount, setAmount] = useState(0);
  const [paypalButtonsLoaded, setPaypalButtonsLoaded] = useState(false);
  const [saldo, setSaldo] = useState(balance);



  useEffect(() => {
    fetchBalance();

  }, [saldo]);

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
        setBalance(balanceData.balance); 
      } else {
        console.error('Błąd przy pobieraniu salda:', balanceResponse.statusText);
      }
    } catch (error) {
      console.error('Wystąpił błąd przy pobieraniu salda:', error);
    }
  };



  useEffect(() => {
    let isComponentMounted = true;
    const initializePayPalButtons = async () => {
      try {
        const container = document.getElementById('paypal-button-container');
        if (container && !paypalButtonsLoaded) {
          container.innerHTML = '';

          const paypal = await loadScript({
            'client-id': 'AQoPgLY96X4tWiWhZZH8ckpCuV86C1MHOsEGfbzScwspGVJO4tr0nLO_uz9rPx1TwLc8xlyibkllPOgs',
            currency: 'PLN',
          });

          if (!paypal) {
            console.error('PayPal SDK failed to load.');
            return;
          }

          if (isComponentMounted && paypal) {
            paypal.Buttons({
              createOrder: async (data, actions) => {
                const response = await fetch('https://localhost:7175/api/Payments/create-order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    amount: parseFloat(amount),  
                  }),
                });

                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }

                const result = await response.json();
                return result.orderId;
              },
              onApprove: async (data, actions) => {
                const response = await fetch('https://localhost:7175/api/Payments/capture-order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: data.orderID,
                    amount: parseFloat(amount),  
                    userId: localStorage.getItem('userId'),
                  }),
                });
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                 await fetchBalance(userId, token);
              },
            }).render('#paypal-button-container');

            setPaypalButtonsLoaded(true);
          }
        }
      } catch (error) {
        console.error('Failed to load PayPal SDK:', error);
      }
    };

    initializePayPalButtons();

    return () => {
      isComponentMounted = false;
    };
  }, [amount, paypalButtonsLoaded]);  

  return (
    <div>
      <div>
        <label>Kwota:</label>
        <input
          type="number"
          min="1"
          value={amount || ''}
          onChange={(e) => {
            const value = e.target.value;
            setAmount(value === '' ? 0 : parseFloat(value));
            setPaypalButtonsLoaded(false);  
          }}
        />
      </div>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default TopUpForm;