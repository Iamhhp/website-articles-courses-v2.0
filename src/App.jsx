import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import HeaderFooter from './components/HeaderFooter/HeaderFooter';
import Article from './pages/Article/Article';
import EditCreateArticle from './pages/EditCreateArticle/EditCreateArticle';
import Articles from './pages/Articles/Articles';
import Courses from './pages/Courses/Courses';
import Course from './pages/Course/Course';
import Account from './pages/Account/Account';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import LoginRegister from './pages/LoginRegister/LoginRegister';
import AboutUs from './pages/AboutUs/AboutUs';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HeaderFooter />}>
          <Route path='login-register/*' element={<LoginRegister />} />
          <Route path='home' element={<Home />} />
          <Route path='articles' element={<Articles />} />
          <Route
            path='article/:idArticle'
            element={
              <PrivateRoute>
                <Article />
              </PrivateRoute>
            }
          />
          <Route
            path='article/:editCreate/:idArticle'
            element={
              <PrivateRoute>
                <EditCreateArticle />
              </PrivateRoute>
            }
          />
          <Route path='courses' element={<Courses />} />
          <Route
            path='course/:idCourse'
            element={
              <PrivateRoute>
                <Course />
              </PrivateRoute>
            }
          />
          <Route
            path='account/*'
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route path='about-us' element={<AboutUs />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
