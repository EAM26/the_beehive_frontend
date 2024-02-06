import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import {useContext,} from "react";
import {AuthContext} from "./context/AuthContext";
// import LocaleContextProvider from "./context/LocaleContext";
import TempHome from "./pages/tempPages/TempHome";
import TempRosters from "./pages/tempPages/TempRosters";
import Profile from "./pages/profiles/Profile";
import Users from "./pages/users/Users";

function App() {
    const {isAuth, authLevel} = useContext(AuthContext)
    return (
        <>
            <div className="app-overall-container">
                <Navbar/>
                <Routes>
                    <Route path="/" element={isAuth ? <TempHome/> : <Login/>}/>
                    <Route path="/login" element={!isAuth ? <Login/> : <TempHome/>}/>
                    <Route path="/profile/:username" element={isAuth ? <Profile/> : <Navigate to="/login"/>}/>
                    <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to="/login"/>}/>
                    <Route path="/users" element={isAuth && (authLevel !== 'user') ? <Users/> : <Navigate to={'/'}/>}/>
                    <Route path="/rosters" element={isAuth && (authLevel !== 'user') ? <TempRosters/> : <Navigate to={'/'}/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;