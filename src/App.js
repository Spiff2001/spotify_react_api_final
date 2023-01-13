import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './Home';
import PlaylistPage from './PlaylistPage';




function App() {
return (
    <Router>
    <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/PlaylistPage' element={<PlaylistPage/>} />
    </Routes>
    </Router>
);
}
  
export default App;