import React from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const navigate = useNavigate();  // Hook to navigate between pages
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const extraPrice = item.selectedExtras?.reduce((extraAcc, extra) => {
        const extraItem = item.extras.find(ex => ex.name === extra);
        return extraAcc + (extraItem?.price || 0);
      }, 0) || 0;
      return acc + item.price + extraPrice;
    }, 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    // Check if the cart has items before proceeding
    if (cartItems.length > 0) {
      navigate('/checkout');  // Navigates to the CheckoutPage
    } else {
      alert("Your cart is empty. Please add items to your cart first.");
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="cart-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span>₵{item.price.toFixed(2)}</span>
              <ul>
                {item.selectedExtras?.map((extra, idx) => (
                  <li key={idx}>{extra}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h2>Total: ₵{calculateTotal()}</h2>
        <button onClick={handleProceedToCheckout}>Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default CartPage;