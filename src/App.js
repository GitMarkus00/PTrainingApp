import './App.css';
import CustomerList from './Components/CustomerList';
import TrainingList from './Components/TrainingList'
import {Routes, Route, BrowserRouter} from "react-router-dom"



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<CustomerList/ >}></Route>
        <Route path="/traininglist" exact element={<TrainingList/ >}></Route>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
