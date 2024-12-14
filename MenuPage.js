import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import '../styles/MenuPage.css';

function MenuPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [showNutritionalFacts, setShowNutritionalFacts] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Menu items data with categories
  const menuItems = [
    { 
      id: 1, 
      name: 'Pizza', 
      description: 'Delicious cheese pizza', 
      price: 40.00, 
      image: '/images/pizza.jpg', 
      category: 'Pizza',
      nutritionalFacts: 'Calories: 250, Carbs: 30g, Protein: 15g, Fat: 10g',
      extras: [
        { name: 'Extra Cheese', price: 5.00 },
        { name: 'Olives', price: 3.00 },
        { name: 'Peppers', price: 2.00 },
        { name: 'Mushrooms', price: 3.00 }
      ]
    },
    { 
      id: 2, 
      name: 'Burger', 
      description: 'Juicy beef burger', 
      price: 25.00, 
      image: '/images/burger.jpg',
      category: 'Burgers',
      nutritionalFacts: 'Calories: 350, Carbs: 45g, Protein: 25g, Fat: 15g',
      extras: [
        { name: 'Bacon', price: 4.00 },
        { name: 'Extra Lettuce', price: 2.00 },
        { name: 'Cheese', price: 2.50 },
        { name: 'Pickles', price: 1.00 }
      ]
    },
    { 
      id: 3, 
      name: 'Pasta', 
      description: 'Creamy Alfredo pasta', 
      price: 35.00, 
      image: '/images/pasta.jpg', 
      category: 'Pasta',
      nutritionalFacts: 'Calories: 400, Carbs: 50g, Protein: 20g, Fat: 15g',
      extras: [
        { name: 'Grilled Chicken', price: 6.00 },
        { name: 'Mushrooms', price: 3.00 },
        { name: 'Parmesan', price: 2.00 }
      ]
    },
    { 
      id: 4, 
      name: 'Fried Rice', 
      description: 'Fried rice with chicken and veggies', 
      price: 30.00, 
      image: '/images/friedrice.jpg', 
      category: 'Rice & Grains',
      nutritionalFacts: 'Calories: 500, Carbs: 60g, Protein: 25g, Fat: 20g',
      extras: [
        { name: 'Extra Chicken', price: 7.00 },
        { name: 'Pineapple', price: 4.00 },
        { name: 'Egg', price: 2.00 }
      ]
    },
    { 
      id: 5, 
      name: 'Grilled Chicken', 
      description: 'Grilled chicken with sides', 
      price: 50.00, 
      image: '/images/grilledchicken.jpg', 
      category: 'Grilled',
      nutritionalFacts: 'Calories: 300, Carbs: 15g, Protein: 40g, Fat: 10g',
      extras: [
        { name: 'Extra Veggies', price: 4.00 },
        { name: 'BBQ Sauce', price: 2.00 },
        { name: 'Rice', price: 3.00 }
      ]
    },
    { 
      id: 6, 
      name: 'Smoothie', 
      description: 'Fruit smoothie', 
      price: 15.00, 
      image: '/images/smoothie.jpg', 
      category: 'Drinks',
      nutritionalFacts: 'Calories: 150, Carbs: 30g, Protein: 2g, Fat: 2g',
      extras: [
        { name: 'Protein Powder', price: 3.00 },
        { name: 'Almond Milk', price: 2.00 },
        { name: 'Honey', price: 1.50 }
      ]
    },
    { 
      id: 7, 
      name: 'Salad', 
      description: 'Fresh vegetable salad', 
      price: 20.00, 
      image: '/images/salad.jpg', 
      category: 'Salads',
      nutritionalFacts: 'Calories: 100, Carbs: 20g, Protein: 5g, Fat: 2g',
      extras: [
        { name: 'Grilled Chicken', price: 5.00 },
        { name: 'Avocado', price: 3.00 },
        { name: 'Olives', price: 2.50 }
      ]
    }
  ];

  // Group menu items by category
  const menuByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Check user authentication on page load
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login page if not authenticated
    } else {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, [navigate]);

  // Load cart items from backend (or localStorage as fallback)
  useEffect(() => {
    if (userId) {
      // Optionally, fetch cart items from the backend
      axios.get(`http://localhost:5000/cart/${userId}`)
        .then((response) => {
          setCartItems(response.data.cartItems); // Assuming the backend returns an array of cart items
        })
        .catch((error) => {
          console.error('Error loading cart items:', error);
        });
    } else {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItems(savedCartItems);
    }
  }, [userId]);

  // Handle add to cart
  const handleAddToCart = (item, selectedExtras) => {
    const updatedItem = { ...item, selectedExtras };
    const updatedCartItems = [...cartItems, updatedItem];
    setCartItems(updatedCartItems);

    if (userId) {
      // Send cart update to backend if the user is logged in
      axios.post(`http://localhost:5000/cart/${userId}`, { cartItems: updatedCartItems })
        .then((response) => {
          console.log('Cart updated successfully');
        })
        .catch((error) => {
          console.error('Error updating cart:', error);
        });
    } else {
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // For guests, save in localStorage
    }
  };

  // Toggle extra options for an item
  const handleToggleExtra = (itemId, extraName) => {
    setSelectedExtras(prev => ({
      ...prev,
      [itemId]: prev[itemId]?.includes(extraName)
        ? prev[itemId].filter(extra => extra !== extraName)
        : [...(prev[itemId] || []), extraName]
    }));
  };

  // Calculate total cart price
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const extraPrice = item.selectedExtras?.reduce((extraAcc, extra) => {
        const extraItem = item.extras.find(ex => ex.name === extra);
        return extraAcc + (extraItem?.price || 0);
      }, 0) || 0;
      return acc + item.price + extraPrice;
    }, 0).toFixed(2);
  };

  // Toggle nutritional facts visibility
  const toggleNutritionalFacts = (itemId) => {
    setShowNutritionalFacts(showNutritionalFacts === itemId ? null : itemId);
  };

  return (
    <div className="menu-container">
      <h1>E's Cuisine Menu</h1>

      <div className="menu-items">
        {Object.keys(menuByCategory).map((category) => (
          <div key={category} className="menu-category">
            <h2>{category}</h2>
            <div className="menu-item-group">
              {menuByCategory[category].map((item) => (
                <div key={item.id} className="menu-item">
                  <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />
                  <div className="menu-item-details">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span>{`₵${item.price.toFixed(2)}`}</span>

                    {/* Nutritional Facts Toggle */}
                    <button onClick={() => toggleNutritionalFacts(item.id)}>View Nutritional Facts</button>
                    {showNutritionalFacts === item.id && (
                      <p>{item.nutritionalFacts}</p>
                    )}

                    {/* Extras (Customization options) */}
                    <div className="extras">
                      <h4>Customize your order:</h4>
                      {item.extras.map((extra) => (
                        <div key={extra.name} className="extra-option">
                          <label>
                            <input
                              type="checkbox"
                              checked={selectedExtras[item.id]?.includes(extra.name) || false}
                              onChange={() => handleToggleExtra(item.id, extra.name)}
                            />
                            {extra.name} (₵{extra.price.toFixed(2)})
                          </label>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => handleAddToCart(item, selectedExtras[item.id] || [])}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Cart Total: ₵{calculateTotal()}</h2>
        <button onClick={() => navigate('/cart')}>Go to Cart</button>
      </div>
    </div>
  );
}

export default MenuPage;