import { createBrowserRouter } from 'react-router-dom';
import { CoinDetailsPage } from '../pages/CoinDetails/CoinDetailsPage';
import { HomePage } from '../pages/Home/HomePage';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/coin/:id',
        element: <CoinDetailsPage />,
      },
      {
        path: '/portfolio',
        element: <div>Portfolio Page (Coming Soon)</div>,
      },
    ],
  },
]);
