import "./index.css";
import React from "react";
import { render } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import { Provider } from "./models";
import ProgramDetails from "./pages/ProgramDetails";
import ProgramExecution from "./pages/ProgramExecution";

function App() {
  return (
    <Provider>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/programs/:id/execute" element={<ProgramExecution />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

render(<App />, document.getElementById("app"));
