import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";
import Login from "./pages/login/Login";
import {useContext} from "react";
import {AuthContext} from "./context/AuthContext";
import TempHome from "./pages/tempPages/tempHome";

function App() {
     const { isAuth } = useContext(AuthContext)
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<TempHome/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/employees" element={ isAuth ? <Employees/> : <Navigate to={'/login'} /> }/>
            </Routes>
        </>
    );
}

export default App;