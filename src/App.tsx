import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Submit } from './pages/Submit';
import { StateDetails } from './pages/StateDetails';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/state/:stateCode" element={<StateDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
