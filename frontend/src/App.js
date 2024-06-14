import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./Pages/Chat";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import SendOtp from "./Pages/SendOtp";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/forgetpassword" element={<SendOtp />} />
          {/* <Route path="/resetpassword/:token" element={<ResetPassword />} /> */}
        </Routes>
    </div>
  );
}

export default App;
