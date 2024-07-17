// Import key packages
import './App.css';
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import { Typography } from '@mui/material';
import React from 'react';

// Import pages
import ViewImage from "./pages/ViewImage";
import NoPage from "./pages/NoPage";

// Testing packages
import { useState, useEffect, useRef, useMemo, createContext, useContext, useCallback } from "react";
import ReactDOM from "react-dom/client";
import Todos from "./Todos";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ViewImage />} />
        <Route path="/nopage" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  
  );
}


const useCustomHook = () => {
  const [data, setData] = useState(null);
  useEffect(()=>{
    setData(2);
    console.log(`Value Set ${data}`)
  }, [])

  // useMemo(()=>{
  //   setData(2);
  //   console.log("Value Set")
  // }, [])

  console.log(data)
  return [data];
};





export function Test() {
  console.log("Enter Hook")
  const [data] = useCustomHook();
  console.log("Exit Hook")

  return (
    <>
      {data}
    </>
  );
};




// export class Test extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: 0,
//     };
//   }

//   componentDidMount() {
//     setTimeout(() => {
//       this.setState((prevState) => ({ count: prevState.count + 1 }));
//       this.setState((prevState) => ({ count: prevState.count + 1 }));
//     }, 2000);
//   }

//   render() {
//     return <div>{this.state.count}</div>;
//   }
// }   // conclusion: each render results in a commit to the real DOM.


// export function Test() {
//   const [data, setData] = useState(null);
//   useEffect(()=>{
//     setData(data+1);
//     console.log(`Value Set ${data}`)
//   })
//   return (
//     <>
//       {data}
//       <input />
//     </>
//   );
// };

