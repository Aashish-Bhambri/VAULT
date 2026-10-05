import { useEffect, useState } from "react";
import api from "./services/api";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {


  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path='/games/:slug' element={<MainLayout />}>
        <Route index element={<GameDetails />} />
      </Route>
      <Route path='/login' >
        <Route index element= {<LoginPage/>}/>
      </Route>
      <Route path='/signup' >
        <Route index element= {<SignupPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;