import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import LoadingSuspense from './components/LoadingSuspense';
import useRoutes from './config/routes';

function App() {
  return (
    <Suspense fallback={<LoadingSuspense />}>
      <RouterProvider router={useRoutes()} />
    </Suspense>
  );
}

export default App;
