
# Ecommerce Watch Store Backend

Welcome to the repository for the backend of an ecommerce watch store built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This project serves as the backend infrastructure for an online store selling watches.

## Overview

This project implements the backend functionalities required for an ecommerce platform, including user authentication, product management, and file uploads. It provides a RESTful API for the frontend to interact with and manage data.

## Technologies Used

- **MongoDB**: NoSQL database for storing product, user, and order data.
- **Express.js**: Node.js framework used to build the RESTful API endpoints.
- **Node.js**: JavaScript runtime environment for server-side code execution.
- **JWT (JSON Web Tokens)**: Used for user authentication and session management.
- **Multer and Cloudinary**: Libraries for handling file uploads and cloud storage.
- **Mongoose**: MongoDB object modeling for Node.js applications.

## Folder Structure

```
├── config/
│   ├── dbConnect.js
│   ├── jswebtoken.js
│   └── refreshToken.js
├── controllers/
│   ├── brandCtrl.js
│   ├── categoryCtrl.js
│   ├── emailCtrl.js
│   ├── enquiryCtrl.js
│   ├── productCtrl.js
│   ├── uploadCtrl.js
│   └── userCtrl.js
├── middlewares/
│   ├── authMW.js
│   ├── errorHandling.js
│   └── fileUpload.js
├── models/
│   ├── brandModel.js
│   ├── cartModel.js
│   ├── categoryModel.js
│   ├── enquiryModel.js
│   ├── orderModel.js
│   ├── productModel.js
│   └── userModel.js
├── routes/
│   ├── authRoute.js
│   ├── brandRoute.js
│   ├── categoryRoute.js
│   ├── enquiryRoute.js
│   ├── productRoute.js
│   └── uploadRoute.js
├── utils/
│   ├── cloudinary.js
│   └── validation.js
├── index.js
├── package-lock.json
└── package.json
```

## Features

- **User Authentication**: Provides endpoints for user registration, login, and authentication using JWT.
- **Product Management**: Allows CRUD operations for products, including creation, retrieval, update, and deletion.
- **File Uploads**: Supports file uploads for product images using Multer and integrates with Cloudinary for cloud storage.
- **Error Handling**: Implements centralized error handling and validation for API endpoints.
- **Modular Architecture**: Organized into controllers, models, routes, and middlewares for scalability and maintainability.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Watch-Store.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Watch-Store
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory and add the following:

   ```
   PORT = ####
   MONGODB_URL = ####
   SECRET_KEY = ####
   MAIL_ID = ####
   MAIL_PW = ####
   CLOUD_NAME = ####
   API_KEY = ####
   ```

   Replace `PORT`, `MONGODB_URL`, `SECRET_KEY`, `MAIL_ID`, `MAIL_PW`, `CLOUD_NAME`, and `API_KEY` with your own values.

5. Start the server:

   ```bash
   npm start
   ```

   The backend server will start running on the specified port (default: 3000).

## API Documentation

For detailed API documentation and usage, refer to the Postman collection provided in the `docs/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
