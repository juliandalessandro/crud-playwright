import './App.css';
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {

  const [listOfRecords, setListOfRecords] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    })
  }, []);

  return (
    <Router>
      <div className="App"> 
      
        <Navbar />
        
        {listOfRecords.map((value, key) => {
          return <div>

            <div> {value.title} </div>
            <div> {value.artist} </div>
            <div> {value.year} </div>
            <div> {value.genre} </div>

          </div>
        })}

        <Routes>
          <Route path="/" />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
