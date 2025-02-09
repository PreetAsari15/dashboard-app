// eslint-disable-line
/*eslint no-undefined: "error"*/

// Redundant for now
// import React, { createContext, useContext, useState } from "react"; //adding react hooks

// const StateContext = createContext();

// const initialState = {
//   chat: false,
//   cart: false,
//   userProfile: false,
//   notification: false,
// };

// export const ContextProvider = ({ children }) => {
//   const [activeMenu, setActiveMenu] = useState(true);
//   const [isClicked, setIsClicked] = useState(initialState);
//   const [screenSize, setScreenSize] = useState(undefined); // eslint-disable-line
//   const handleClick = (clicked) =>
//     setIsClicked({ ...initialState, [clicked]: true });
//   return (
//     <StateContext.Provider
//       value={{
//         activeMenu,
//         setActiveMenu,
//         isClicked,
//         setIsClicked,
//         handleClick,
//         screenSize,
//         setScreenSize,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// export const useStateContext = () => useContext(StateContext);

import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  // set variables
  const [screenSize, setScreenSize] = useState(undefined); // eslint-disable-line
  const [currentColor, setCurrentColor] = useState("#567189");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
