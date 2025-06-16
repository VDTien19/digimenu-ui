import { io } from 'socket.io-client';

// const socket = io(`${import.meta.env.VITE_API_URL}`, {
//   transports: ['websocket'],
//   autoConnect: false,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
// });

// const socket = io();

const socket = io({
  autoConnect: false, // QUAN TRỌNG
  transports: ['websocket'],
});


export default socket;
