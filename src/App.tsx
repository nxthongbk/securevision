import { Suspense, useContext } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import LoadingSuspense from './components/LoadingSuspense';
import useRoutes from './config/routes';
import { AppContext } from './contexts/app.context';

function App() {
  const { userInfo } = useContext(AppContext);
  return (
    <Suspense fallback={<LoadingSuspense />}>
      <RouterProvider router={useRoutes(userInfo?.roles[0])} />
    </Suspense>
  );
}

export default App;
