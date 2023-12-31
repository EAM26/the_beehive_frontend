import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Employees from "./pages/employees/Employees";
import Login from "./pages/login/Login";
import {useContext,} from "react";
import {AuthContext} from "./context/AuthContext";
import TempHome from "./pages/tempPages/TempHome";
import TempRosters from "./pages/tempPages/TempRosters";
import Profile from "./pages/profiles/Profile";

function App() {
    const {isAuth, authLevel } = useContext(AuthContext)
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={isAuth ? <TempHome/> : <Login/>}/>
                <Route path="/login" element={!isAuth ? <Login/> : <TempHome/>}/>
                <Route path="/profile/:id" element={isAuth ? <Profile/> : <Navigate to={'/login'}/>}/>
                <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to={'/login'}/>}/>
                <Route path="/employees" element={isAuth && (authLevel !== 'user') ? <Employees/> : <Navigate to={'/'}/>}/>
                <Route path="/rosters" element={isAuth && (authLevel !== 'user') ? <TempRosters/> : <Navigate to={'/'}/>}/>
            </Routes>
        </>
    );
}

export default App;