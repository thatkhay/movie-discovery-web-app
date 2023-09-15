
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MovieDetails from './pages/MovieDetails';
function App() {
  return (
    <div className="App">
       <Router>
      <Routes>
        <Route  path="/" element={<HomePage/>} />
        <Route path="/movies/:id" element={<MovieDetails/>} />
      </Routes>
    </Router>
    <ToastContainer/>
    
    </div>
  );
}

export default App;
