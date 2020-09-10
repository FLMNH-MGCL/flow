import "./index.css";
import React from "react";
import { render } from "react-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Programs from "./pages/Programs";
import { Provider } from "./models";
import ProgramDetails from "./pages/ProgramDetails";
import ProgramExecution from "./pages/ProgramExecution";

function App() {
  return (
    <Provider>
      <MemoryRouter initialEntries={["/programs"]}>
        <Routes>
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/programs/:id/execute" element={<ProgramExecution />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

render(<App />, document.getElementById("app"));
