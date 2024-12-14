import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const [orderStatus, setOrderStatus] = useState('Preparing');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [updatedCartItems, setUpdatedCartItems] = useState(cartItems);  // Track updated cart items
  const navigate = useNavigate();

  useEffect(() => {
    const points = localStorage.getItem('loyaltyPoints') || 0;
    setLoyaltyPoints(points);

    const statusTimer = setTimeout(() => {
      setOrderStatus('Ready for Pickup');
    }, 5000);  // Simulate status update after 5 seconds

    return () => clearTimeout(statusTimer);
  }, []);

  const handleRemoveItem = (itemIndex) => {
    const updatedItems = updatedCartItems.filter((_, index) => index !== itemIndex);
    setUpdatedCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleAdjustExtras = (itemIndex, extraItem) => {
    const updatedItems = [...updatedCartItems];
    const item = updatedItems[itemIndex];
    const extras = item.selectedExtras || [];
    if (extras.includes(extraItem)) {
      item.selectedExtras = extras.filter(extra => extra !== extraItem);
    } else {
      item.selectedExtras = [...extras, extraItem];
    }
    setUpdatedCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleCompletePurchase = () => {
    const totalAmount = parseFloat(updatedCartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2));
    const pointsEarned = Math.floor(totalAmount / 10);  // Example: 1 point for every ₵10 spent
    const newLoyaltyPoints = parseInt(loyaltyPoints) + pointsEarned;

    localStorage.setItem('loyaltyPoints', newLoyaltyPoints);
    alert(`Purchase complete! You earned ${pointsEarned} loyalty points. Total loyalty points: ${newLoyaltyPoints}`);
    navigate('/');  // Redirect to home page after purchase
  };

  const calculateTotal = () => {
    return updatedCartItems.reduce((acc, item) => {
      const extraPrice = item.selectedExtras?.reduce((extraAcc, extra) => {
        const extraItem = item.extras.find(ex => ex.name === extra);
        return extraAcc + (extraItem?.price || 0);
      }, 0) || 0;
      return acc + item.price + extraPrice;
    }, 0).toFixed(2);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div>
        <h3>Your Order</h3>
        {updatedCartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          updatedCartItems.map((item, index) => (
            <div key={index} className="order-item">
              <p>{item.name}</p>
              <p>{item.description}</p>
              <span>₵{item.price}</span>
              
              {/* Display selected extras and allow adjustments */}
              <div>
                <h4>Extras</h4>
                <ul>
                  {item.selectedExtras?.map((extra, idx) => (
                    <li key={idx}>{extra}</li>
                  ))}
                </ul>
                <div>
                  {item.extras?.map((extra, idx) => (
                    <button key={idx} onClick={() => handleAdjustExtras(index, extra.name)}>
                      {item.selectedExtras?.includes(extra.name) ? `Remove ${extra.name}` : `Add ${extra.name}`}
                    </button>
                  ))}
                </div>
              </div>
              
              <button onClick={() => handleRemoveItem(index)}>Remove Item</button>
            </div>
          ))
        )}
      </div>

      <div>
        <h3>Total: ₵{calculateTotal()}</h3>
        <h4>Order Status: {orderStatus}</h4>
        <p>{orderStatus === 'Ready for Pickup' && 'Your order is ready to be picked up!'}</p>
      </div>

      <div>
        <h4>Loyalty Points: {loyaltyPoints}</h4>
        <p>Earn points for every order and redeem them for discounts!</p>
      </div>

      <div>
        <button onClick={handleCompletePurchase}>Complete Purchase</button>
      </div>
    </div>
  );
}

export default CheckoutPage;