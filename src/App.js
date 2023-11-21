import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";
import Login from "./pages/login/Login";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";

function App() {
     const { isAuth } = useContext(AuthContext)
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/employees" element={ isAuth ? <Employees/> : <Navigate to={'/login'} /> }/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </>
    );
}

export default App;