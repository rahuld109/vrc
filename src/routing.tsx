import { createBrowserRouter } from 'react-router-dom';
import App from './pages/App';
import Navigate from './pages/Navigate';
import AppLayout from './AppLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <App /> },
      {
        path: 'navigate',
        element: <Navigate />,
      },
    ],
  },
]);

export default router;
