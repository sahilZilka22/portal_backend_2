# Project README

This is a README file for your project. It contains information about the endpoints used in your project and instructions on how to switch between them during development.

## Endpoints Configuration

### Production Endpoints

- **Frontend URL (Production):** [https://dooper-frontend.onrender.com](https://dooper-frontend.onrender.com)
- **Backend URL (Production):** [https://backend-p1wy.onrender.com/api/v1](https://backend-p1wy.onrender.com/api/v1)

### Development Endpoints

- **Frontend Local URL (Development):** http://localhost:3000
- **Backend Local URL (Development):** http://localhost:5001

## Switching Between Endpoints
You can start by changing the endpoint in the backend at first and then move onto the frontend.

1. Open your backend folder (e.g., `src/api/api.js`).
2. Locate the server.js file and section where we have defined the backend URL.
3. Update the URL to the appropriate endpoint based on your development or production needs.
4. Save the file.

To switch between production and development endpoints in your project, follow these steps:
I will list down the files that are to be updated in the frontend

1. MyChats.js
2. SignUpBox.js
3. LoginBox.js
4. NewSingleChat.js
5. SideDrawer,js
6. UpdateGroupModal.js
7. GroupChatModal.js

Use the instructions given :

1. Open your frontend code (e.g., `src/api/api.js`).
2. Locate the package.json file and section where we have defined the backend URL (i.e. "proxy": "http://127.0.0.1:5001/",).
3. Update the URL to the appropriate endpoint based on your development or production needs.
4. Save the file.

Example (in `src/api/api.js`):

Change the baseURL to switch the enviroment with localbackend and backend 

```javascript

const backend = 'https://backend-p1wy.onrender.com/api/v1'
const localbackend = "http://localhost:5001/api/v1"
const api = axios.create({
      baseURL: localbackend, // Replace with your backend URL
});
