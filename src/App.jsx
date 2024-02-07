import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import HeaderFooter from './components/HeaderFooter/HeaderFooter';
import Article from './pages/Article/Article';
import EditCreateArticle from './pages/EditCreateArticle/EditCreateArticle';
import Articles from './pages/Articles/Articles';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderFooter />}>
          <Route path='Home' element={<Home />} />
          <Route path='Article/:idArticle' element={<Article />} />
          <Route path='Article/:editCreate/:idArticle' element={<EditCreateArticle />} />
          <Route path='/Articles' element={<Articles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
