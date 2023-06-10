import React, { useState } from "react";
import "./App.css";
import Home from "./Home/Home";

export const UserContext = React.createContext()
function App() {
  const [currentUserId, setCurrentUserId] = useState(1)
  return (
    <>
      <UserContext.Provider value={{currentUserId, setCurrentUserId}}>
        <Home />
      </UserContext.Provider>
    </>
  )
}

export default App;
