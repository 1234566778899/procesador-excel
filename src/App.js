import { Routes } from 'react-router-dom';
import './App.css';
import { HomeApp } from './components/HomeApp';
import { Route } from 'react-router-dom/dist/umd/react-router-dom.development';



function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<HomeApp />} />
        <Route exact path='/home' element={<HomeApp />} />
      </Routes>
    </>
  );
}

export default App;
