Canteen Ordering System

Project Overview
The Canteen Ordering System is a web application designed to allow users to order food from a canteen or cafeteria. It offers a user-friendly interface for customers to browse food items, place orders, and make payments. Admins can manage the food menu and track orders. This system streamlines the food ordering process, reducing wait times and improving user experience.



Login Details
For testing the authentication and login functionality, use the following credentials:

Username: testuser@example.com
Password: password123

Feature Checklist
 User login and registration
 View available food items
 Add items to the cart
 Place orders and make payments
 Admin dashboard for managing menu items
 Order history for users
 Order tracking for admins
 Responsive design (mobile and desktop)
 Integration with third-party payment gateway (future feature)
 
Installation Instructions

To run the Canteen Ordering System locally, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/your-username/canteen-ordering-system.git
Navigate to the project directory:

bash
Copy code
cd canteen-ordering-system
Install dependencies: For frontend:

bash
Copy code
npm install
For backend (if applicable):

bash
Copy code
npm install
Run the project:

For frontend:
bash
Copy code
npm start
For backend:
bash
Copy code
npm run dev
Open the application in your browser at http://localhost:3000.

API Documentation
Here is a screenshot showing the Postman tests for the project's API endpoints:



Example Endpoints:
POST /login
Description: Authenticates the user.
Request Body:

json
Copy code
{
  "username": "testuser@example.com",
  "password": "password123"
}
GET /menu
Description: Retrieves the list of available food items.

POST /order
Description: Places an order for the selected food items.
Request Body:

json
Copy code
{
  "items": [
    {"id": "1", "quantity": 2},
    {"id": "2", "quantity": 1}
  ],
  "total": 15.50
}
GET /orders/{userId}
Description: Fetches order history for the user.
