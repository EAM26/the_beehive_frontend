import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";
import Login from "./pages/login/Login";

function App() {
    return (
        <>
            <Navbar/>
            <Routes>
            <Route path="/employees" element={<Employees/>}/>
            <Route path="/login" element={<Login/>}/>
            </Routes>
        </>
    );
}

export default App;