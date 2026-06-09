import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Login from './pages/Login'
import ExecutiveSummary from './pages/ExecutiveSummary'
import Financial from './pages/Financial'
import HR from './pages/HR'
import Operational from './pages/Operational'
import GA from './pages/GA'
import Legal from './pages/Legal'
import Compliance from './pages/Compliance'
import Marketing from './pages/Marketing'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"            element={<ExecutiveSummary />} />
          <Route path="/financial"   element={<Financial />} />
          <Route path="/hr"          element={<HR />} />
          <Route path="/operational" element={<Operational />} />
          <Route path="/marketing"   element={<Marketing />} />
          <Route path="/ga"          element={<GA />} />
          <Route path="/legal"       element={<Legal />} />
          <Route path="/compliance"  element={<Compliance />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
