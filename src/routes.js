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

export const listRoutes = [
  {
    path: '/',
    element: <HeaderFooter />,
    children: [
      { path: 'login-register/*', element: <LoginRegister /> },
      { path: 'home', element: <Home /> },
      { path: 'articles', element: <Articles /> },
      {
        path: 'article/:idArticle',
        element: (
          <PrivateRoute>
            <Article />
          </PrivateRoute>
        ),
      },
      {
        path: 'article/:editCreate/:idArticle',
        element: (
          <PrivateRoute>
            <EditCreateArticle />
          </PrivateRoute>
        ),
      },
      { path: 'courses', element: <Courses /> },
      {
        path: 'course/:idCourse',
        element: (
          <PrivateRoute>
            <Course />
          </PrivateRoute>
        ),
      },
      {
        path: 'account/*',
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
      },
      { path: 'about-us', element: <AboutUs /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
