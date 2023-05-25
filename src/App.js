import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import for toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// users form
import Form from "./comps/form";
// 404 page
import Page404 from "./comps/page404";
// admin panel
import Layout from "./adminComps/layout";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Users Form */}
          <Route path="/" element={<Form />} />
          {/* Admin */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Form />} />
          </Route>
          {/* for any url that not in another route go to 404 */}
          <Route path="/*" element={<Page404 />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </div>
  );
}

export default App;
