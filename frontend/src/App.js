import React from "react";
import { Route, Routes } from "react-router-dom";
import CryptoGraphs from "./CryptoWebsocket";
import Services from "./services/Services";
// import cryptoData from './cryptoData/Cryptodata'
import "./broadcast/Broadcast";
import Broadcast from "./broadcast/Broadcast";
import Headsection from "./headSection/Headsection";
import Navbar from "./navbar/Navbar";
// import RealTimeData from './cryptoData/Cryptodata'
// import CryptoWidget from './cryptoData/CryptoWidget'
import Footer from "./Footer/Footer";
import RiskWarning from "./Risk/Risk";
import Help from "./help/Help";
import CryptoData from "./cryptoData/CryptoData";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";
// import CryptoMonth from "./CryptoMonth";
import CryptoWebsocket from "./CryptoWebsocket";
import CryptoOneDay from "./CryptoOneDay";
import CryptoWeek from "./CryptoWeek";
import CryptoMonths from "./CryptoMonths";
import CryptoThreeMonths from "./CryptoThreeMonths";

import StockRest from "./Stock";


const App = () => {
  
  return (
    <div className="App">
  

      <Navbar />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cryptoWebsocket" element={<CryptoWebsocket />} />
        <Route path="/cryptoOneday" element={ <CryptoOneDay />} />
        <Route path="/cryptoweek" element={<CryptoWeek />} />
        <Route path="/cryptomonth" element={<CryptoMonths />} />
        <Route path="/cryptothreemonths" element={<CryptoThreeMonths/>} />
        <Route path="/stock" element={<StockRest />} />


      </Routes>
      {/* <CryptoWeek/> */}
      {/* <CryptoMonths/> */}
      {/* <CryptoThreeMonths/> */}
       {/* <CryptoWebsocket/> */}
      {/* <Broadcast/> */}
      {/* <Headsection/> */}
      {/* <CryptoData/> */}
      {/* <Services/> */}
      {/* <Help/> */}
      {/* <RiskWarning/> */}
      {/* <Footer/> */}
      {/* <CryptoRest /> */}
      {/* <CryptoMonth /> */}
      
    </div>
  );
};

export default App;
