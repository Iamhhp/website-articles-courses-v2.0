import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import HeaderFooter from './components/HeaderFooter/HeaderFooter';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderFooter />}>
          <Route path='Home' element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
