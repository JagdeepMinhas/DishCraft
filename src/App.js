import './App.css';
import Home from './Home';
import Header from './Header';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SavedRecipe from './SavedRecipe';
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path ='/' element ={[<Header/>,<Home/>]}/>
        <Route path ='/savedRecipes' element ={[<Header/>, <SavedRecipe/>]}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
