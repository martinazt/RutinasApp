import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Routines } from './pages/Routines';
import { Exercises } from './pages/Exercises';
import { RoutineEditor } from './pages/RoutineEditor';
import { Settings } from './pages/Settings';
import { Gyms } from './pages/Gyms';
import { Classes } from './pages/Classes';


function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="routines" element={<Routines />} />
            <Route path="routines/new" element={<RoutineEditor />} />
            <Route path="routines/edit/:id" element={<RoutineEditor />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="gyms" element={<Gyms />} />
            <Route path="classes" element={<Classes />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
