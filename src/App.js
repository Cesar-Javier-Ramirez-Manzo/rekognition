import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddImage from './components/AddImage';
import './App.css';
import Navbar from './components/Navbar';
import SearchFaces from './components/SearchFaces'
import Inicio from './pages/Home'

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Switch> 
          <Route path='/Indexar' component={AddImage} />
          <Route path='/Buscar' component={SearchFaces} />
          <Route path='/' component={Inicio} />
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;