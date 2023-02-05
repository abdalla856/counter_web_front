import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerView from "./views/customer_view";
import CounterManager from "./views/counterview";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerView />} />
        <Route path="/manager" element={<CounterManager />} />
      </Routes>
    </Router>
  );
}

export default App;
