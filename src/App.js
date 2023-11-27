import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";
import Login from "./pages/login/Login";
import {useContext,} from "react";
import {AuthContext} from "./context/AuthContext";
import TempHome from "./pages/tempPages/TempHome";
import TempRosters from "./pages/tempPages/TempRosters";
import TempProfile from "./pages/tempPages/TempProfile";

function App() {
    const {isAuth, authLevel } = useContext(AuthContext)
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={isAuth ? <TempHome/> : <Navigate to={'/login'}/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={isAuth ? <TempProfile/> : <Navigate to={'/login'}/>}/>
                <Route path="/employees" element={isAuth && (authLevel !== 'user') ? <Employees/> : <Navigate to={'/'}/>}/>
                <Route path="/rosters" element={isAuth && (authLevel !== 'user') ? <TempRosters/> : <Navigate to={'/'}/>}/>
            </Routes>
        </>
    );
}

export default App;