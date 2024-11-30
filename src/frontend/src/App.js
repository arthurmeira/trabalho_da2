import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './paginas/login'; // Caminho do arquivo Login
import Dashboard from './paginas/Dashboard'; // Caminho do arquivo Dashboard
import Dashboard2 from './paginas/Dashboard2';
import UserPage from './paginas/userpage';
import TeacherPage from './paginas/TeacherPage';
import StudentPage from './paginas/StudentPage';
import ProfessionalPage from './paginas/ProfessionalPage';
import EventPage from './paginas/EventPage';
import AppointmentPage from './paginas/AppointmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/techerpage" element={<TeacherPage/>} />
        <Route path="/StudentPage" element={<StudentPage/>} />
        <Route path="/ProfessionalPage" element={<ProfessionalPage/>} />
        <Route path="/EventPage" element={<EventPage/>} />
        <Route path="/AppointmentPage" element={<AppointmentPage/>} />
      </Routes>
    </Router>
  );
}

export default App;