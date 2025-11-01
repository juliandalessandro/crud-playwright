import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListOfRecords from "./pages/ListOfRecords";
import UploadRecord from "./pages/UploadRecord";
import Login from "./pages/Login";
import Register from './pages/Register';
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <Router>
      <div className="App"> 

        <Routes>
          <Route path="/" element={<ProtectedRoute><ListOfRecords /></ProtectedRoute>}/>
          <Route path="/uploadRecord" element={<ProtectedRoute><UploadRecord /></ProtectedRoute>}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
