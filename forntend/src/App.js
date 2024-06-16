import { useState } from 'react';
import './App.css';

import Chatbox from './pages/Chatbox';
import AdminsPanel from './pages/AdminsPanel';
function App() {
  const [message, setmeassage] = useState(true)
  const [sendIcon, setSendIcon] = useState(false)
  return (
  <>
  {/* <Chatbox/> */}
  <AdminsPanel/>
  </>
  );
}

export default App;
