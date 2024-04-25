import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import './SavedRecipe.css';
import Popup from 'reactjs-popup';

const SavedRecipe = () => {
  // State to hold saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  // State to track the selected recipe for pop-up display
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate();

 // useEffect to retrieve saved recipes from server on component mount
  useEffect(() =>{
    fetch('http://localhost:8080/get-all-recipe')
      .then(response =>response.json())
      .then(data => setSavedRecipes(data))
      .catch(error => console.error('Error fetching saved recipes:', error))
  },[]);

  
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleDeleteRecipe = () =>{
 
    fetch('http://localhost:8080/delete-recipe', {
      method: 'DELETE',
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify({name: selectedRecipe.name}),
    })
    .then(response =>response.json())
    .then(data => {
      alert(data.message)
      console.log(data.message); // Log the message from the server
      setSavedRecipes(data.updatedRecipes); // Update the state with the updated list
    })
    .catch(error => console.error('Error deleting recipe:', error));
    setSelectedRecipe(null);
  };

  const handleUpdateRecipe =()=>{
    navigate('/', { state: { recipe: selectedRecipe } });
  };

  const handleClosePopup = () => {
    setSelectedRecipe(null);
  };
  console.log(savedRecipes);
  return (
    <div className='saved_recipe_container'>
      <div className='saved_recipe'> 
        <h2>Saved Recipes</h2>
        <ul>
          {savedRecipes.map((recipe)=>(
            <li key={recipe.name} onClick={()=>handleRecipeClick(recipe)}>
              {recipe.name}
            </li>
          ))}
        </ul>
            
        {selectedRecipe && (
        <Popup
          open={true} 
          position="center"
          closeOnDocumentClick= {false}
        >
          <div className='popup_container'>
            <h3>{selectedRecipe.name}</h3>
            <p>Ingredients:</p>
            {selectedRecipe.ingredients.join(', ')}
            <p>Directions:</p>
            <ul>
                  {selectedRecipe.directions.split('\n').map((direction, index) => (
                    <li key={index}>{direction}</li>
                  ))}
            </ul>
            <p>Last Modified:</p> 
             {selectedRecipe.last_modified}
             <div>
            <button onClick= {handleUpdateRecipe}>Edit </button>
            <button onClick={handleDeleteRecipe}>Delete </button>
            <button onClick= {handleClosePopup}>Close </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
    </div>
  );
};

export default SavedRecipe;
