import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import Login from "./pages/Login";
import AllMembers from "./pages/AllMembers";
import AddMember from "./pages/AddMember";
import Payments from "./pages/Payements";
import "./styles/global.css";
import { auth } from "./firebase";

import { useSelector, useDispatch } from "react-redux";
import { loginUser, setLoading, fetchUserData } from "./features/userSlice";

function App() {
  const [theme, colorMode] = useMode();

  //redux
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          loginUser({
            uid: authUser.uid,
            email: authUser.email,
          })
        );
        dispatch(fetchUserData(authUser.uid));
        dispatch(setLoading(false));
      } else {
      }
    });
  }, []);

  const user = useSelector((state) => state.data.user.user);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          {user ? <SideBar /> : null}
          <main className="content">
            {user ? <TopBar />: null}
            <Routes>
              <Route path="/" element={user ? <Dashboard /> : <Login />} />
              <Route path="/add-user" element={user ? <AddUser /> : null} />
              <Route path="/all-members" element={user ? <AllMembers /> : null} />
              <Route path="/add-member" element={user ? <AddMember /> : null} />
              <Route path="/payments" element={user ? <Payments /> : null} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
