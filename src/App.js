import './App.css';
import PathfindingVisualizer from './pages/pathFindingVisualizer';
import Navbar from './pages/Navbar.jsx';
import {Helmet} from "react-helmet";


function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Pathfindr</title>
        <link rel="canonical" href= "https://esypathfindr.netlify.app/" />
      </Helmet>
      <Navbar/>
      <PathfindingVisualizer/>
    </>
  );
}

export default App;
