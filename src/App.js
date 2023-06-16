import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import for toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// users form
import Form from "./comps/form";
// 404 page
import Page404 from "./comps/page404";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Users Form */}
          <Route path="/" element={<Form />} />
          {/* for any url that not in another route go to 404 */}
          <Route path="/*" element={<Page404 />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </div>
  );
}

export default App;
