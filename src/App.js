import './App.css';
import Navbar from "./components/navbar/Navbar";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/login/Login";
import {useContext,} from "react";
import {AuthContext} from "./context/AuthContext";
import Home from "./pages/home/Home";
import Profile from "./pages/profiles/Profile";
import Users from "./pages/users/Users";
import Teams from "./pages/teams/Teams";
import SingleTeam from "./pages/teams/SingleTeam";
import SingleUser from "./pages/users/SingleUser";
import Rosters from "./pages/rosters/Rosters";
import SingleRoster from "./pages/rosters/SingleRoster";
import Footer from "./components/footer/Footer";
import NotFound from "./pages/not found/NotFound";

function App() {
    const {isAuth, authLevel} = useContext(AuthContext)
    return (
        <>
            <div className="app-overall-container">
                <Navbar/>
                <div className="app-content">
                    <Routes>
                        <Route path="/" element={isAuth ? <Home/> : <Login/>}/>
                        <Route path="/login" element={!isAuth ? <Login/> : <Home/>}/>
                        <Route path="/profile" element={isAuth ? <Profile/> : <Navigate to="/login"/>}/>
                        <Route path="/users/:username"
                               element={isAuth && (authLevel !== 'user') ? <SingleUser/> : <Navigate to="/login"/>}/>
                        <Route path="/users"
                               element={isAuth && (authLevel !== 'user') ? <Users/> : <Navigate to={'/'}/>}/>
                        <Route path="/teams/:teamName"
                               element={isAuth && (authLevel !== 'user') ? <SingleTeam/> : <Navigate to={'/'}/>}/>
                        <Route path="/teams"
                               element={isAuth && (authLevel !== 'user') ? <Teams/> : <Navigate to={'/'}/>}/>
                        <Route path="/rosters"
                               element={isAuth && (authLevel !== 'user') ? <Rosters/> : <Navigate to={'/'}/>}/>
                        <Route path="/rosters/:rosterId"
                               element={isAuth && (authLevel !== 'user') ? <SingleRoster/> : <Navigate to={'/'}/>}/>
                        <Route path="*" element={ <NotFound/> }/>

                    </Routes>
                </div>
                <Footer/>
            </div>
        </>
    );
}

export default App;