import './index.css';
import React from 'react';
import { render } from 'react-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Programs from './pages/Programs';
import { Provider } from './models';
import ProgramDetails from './pages/ProgramDetails';
import ProgramExecution from './pages/ProgramExecution';
import Settings from './pages/Settings';
import Layout from './components/Layout';

// initTheme();

function App() {
  return (
    <Provider>
      <MemoryRouter initialEntries={['/programs']}>
        <Layout>
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route
              path="/programs/:id/execute"
              element={<ProgramExecution />}
            />
          </Routes>
        </Layout>
      </MemoryRouter>
    </Provider>
  );
}

render(<App />, document.getElementById('app'));
