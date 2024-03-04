import Navbar from "./Layouts/NavBar";
import Documentation from "./Pages/Documentation";
import Home from "./Pages/Home";
import UADataView from "./Pages/UADataView";
import ChartGen from "./Pages/ChartGen";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/UADataView" element={<UADataView />} />
          <Route path="/ChartGen" element={<ChartGen />} />
          <Route path="/Documentation" element={<Documentation />} />
        </Routes>
      </div>
    </>
  );
}
