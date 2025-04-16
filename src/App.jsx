import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Welcome from "./pages/Welcome/Welcome";
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import SummarizePage from "./pages/AIFeatures/Summarize";
import MindmapPage from "./pages/AIFeatures/Mindmap";
import PowerPointPage from "./pages/AIFeatures/Powerpoint";
import FlashcardsPage from "./pages/AIFeatures/Flashcards";
import MultipleChoicePage from "./pages/AIFeatures/Multiplechoice";
import SolvePage from "./pages/AIFeatures/Solve"
import "./styles/toast.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/summarize" element={<SummarizePage />} />
        <Route path="/mindmap" element={<MindmapPage />} />
        <Route path="/powerpoint" element={<PowerPointPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/multiplechoice" element={<MultipleChoicePage />} />
        <Route path="/solve" element={<SolvePage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        className="toast-small"
      />
    </BrowserRouter>
  );
};

export default App;