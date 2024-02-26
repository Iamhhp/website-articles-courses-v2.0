import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import HeaderFooter from './components/HeaderFooter/HeaderFooter';
import Article from './pages/Article/Article';
import EditCreateArticle from './pages/EditCreateArticle/EditCreateArticle';
import Articles from './pages/Articles/Articles';
import Courses from './pages/Courses/Courses';
import Course from './pages/Course/Course';
import LoginSign from './pages/LoginSign/LoginSign';
import Account from './pages/Account/Account';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderFooter />}>
          <Route path='Home' element={<Home />} />
          <Route path='Article/:idArticle' element={<Article />} />
          <Route path='Article/:editCreate/:idArticle' element={<EditCreateArticle />} />
          <Route path='/Articles' element={<Articles />} />
          <Route path='/Courses' element={<Courses />} />
          <Route path='/Course/:idCourse' element={<Course />} />
          <Route path='/Login-Sign' element={<LoginSign />} />
          <Route path='/Account' element={<Account />} />
        </Route>

        <Route path='*' element={<h1>Not Found!</h1>} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
