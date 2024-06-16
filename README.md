

```markdown
# Watcher  Application

This project is a Zoom-like web application built using the MERN stack (MongoDB, Express, React, Node.js). It provides functionalities for user authentication, meeting management, real-time messaging, and video calls.

## Features

- User Authentication (Register, Login)
- Meeting Management (Create, Join, List Meetings)
- Real-time Messaging
- Video Calls (Using WebRTC and Socket.io)

## Project Structure

```
watcher/
├── forntend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   ├── Meeting/
│   │   │   │   ├── CreateMeeting.js
│   │   │   │   ├── JoinMeeting.js
│   │   │   ├── VideoChat/
│   │   │       ├── VideoChat.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── meetingController.js
│   │   ├── messageController.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Meeting.js
│   │   ├── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── meetings.js
│   │   ├── messages.js
│   ├── server.js
│   ├── package.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/watcher.git
   cd watcher
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

### Configuration

1. Create a `.env` file in the `server` directory and add your MongoDB connection string and JWT secret:
   ```
   MONGO_URI=mongodb://localhost:27017/watcher
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the server
   ```bash
   cd server
   npm start
   ```

2. Start the client
   ```bash
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### API Endpoints

#### Authentication

- **Register**
  - `POST /api/auth/register`
  - Request Body: `{ "username": "example", "email": "example@example.com", "password": "password123" }`

- **Login**
  - `POST /api/auth/login`
  - Request Body: `{ "email": "example@example.com", "password": "password123" }`

- **Get User**
  - `GET /api/auth`
  - Headers: `{ "x-auth-token": "your_token" }`

#### Meetings

- **Create Meeting**
  - `POST /api/meetings`
  - Request Body: `{ "title": "Meeting Title", "startTime": "2022-01-01T00:00:00.000Z", "endTime": "2022-01-01T01:00:00.000Z" }`
  - Headers: `{ "x-auth-token": "your_token" }`

- **Get Meetings**
  - `GET /api/meetings`
  - Headers: `{ "x-auth-token": "your_token" }`

- **Join Meeting**
  - `PUT /api/meetings/join/:meetingId`
  - Headers: `{ "x-auth-token": "your_token" }`

- **Get Meeting**
  - `GET /api/meetings/:meetingId`
  - Headers: `{ "x-auth-token": "your_token" }`

#### Messages

- **Send Message**
  - `POST /api/messages/:meetingId`
  - Request Body: `{ "text": "Your message" }`
  - Headers: `{ "x-auth-token": "your_token" }`

- **Get Messages**
  - `GET /api/messages/:meetingId`
  - Headers: `{ "x-auth-token": "your_token" }`

### Real-time Communication

Real-time messaging and video calls are handled using Socket.io.

- **Join Room**
  ```javascript
  socket.emit('join room', { meetingId, userId });
  ```

- **Send Message**
  ```javascript
  socket.emit('send message', { meetingId, message });
  ```

- **Receive Message**
  ```javascript
  socket.on('receive message', message => {
    // Handle received message
  });
  ```

- **User Joined**
  ```javascript
  socket.on('user joined', userId => {
    // Handle user joined
  });
  ```

### Future Enhancements

- Integrate WebRTC for video calling
- Enhance UI/UX
- Add additional features like screen sharing, recording, etc.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Socket.io](https://socket.io/)

---
```

This `README.md` provides a detailed overview of your project, instructions for setting it up, and a guide to using the API endpoints. Adjust any URLs or paths as necessary to match your project specifics.
