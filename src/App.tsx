import React, { Suspense, lazy } from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Header from './components/Header/Header';


const Home = lazy(() => import('./pages/Home/Home'));
const Details = lazy(() => import('./pages/Details/Details'));

function App() {
  return (
    <HashRouter>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/details/:id' element={<Details />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
