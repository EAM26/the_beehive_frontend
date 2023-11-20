import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
            <Route path="/employees" element={<Employees/>}/>
            </Routes>
        </>
    );
}

export default App;