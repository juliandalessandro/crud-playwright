import './App.css';
import axios from "axios";
import { useEffect, useState } from "react";

function App() {

  const [listOfRecords, setListOfRecords] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/records").then((response) => {
      setListOfRecords(response.data);
    })
  }, []);

  return (
    <div className="App"> {listOfRecords.map((value, key) => {
      return <div>

        <div> {value.title} </div>
        <div> {value.artist} </div>
        <div> {value.year} </div>
        <div> {value.genre} </div>

      </div>
    })}
    </div>
  );
}

export default App;
