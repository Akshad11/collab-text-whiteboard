import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoomLanding from './RoomLanding';
import RoomEditor from './RoomEditor';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RoomLanding />} />
      <Route path="/rooms/:roomId" element={<RoomEditor />} />
    </Routes>
  </BrowserRouter>
);
