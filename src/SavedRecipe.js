import React, { useState, useEffect } from 'react';
import './SavedRecipe.css';
import Popup from 'reactjs-popup';

const SavedRecipe = () => {
  // State to hold saved recipes
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  // State to track the selected recipe for pop-up display
  const [selectedRecipe, setSelectedRecipe] = useState(null);

 // useEffect to retrieve saved recipes from localStorage on component mount
  useEffect(() =>{
    const savedRecipesFromStorage = JSON.parse(localStorage.getItem('savedRecipes'))||[]

    if(Array.isArray(savedRecipesFromStorage)){
      setSavedRecipes(savedRecipesFromStorage);
    }else{
     setSavedRecipes([]);
    }

  },[]);

  
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  
  const handleClosePopup = () => {
    setSelectedRecipe(null);
  };
  
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
            {selectedRecipe.ingredients}
            <p>Directions:</p>
            <ul>
                  {selectedRecipe.directions.split('\n').map((direction, index) => (
                    <li key={index}>{direction}</li>
                  ))}
            </ul>
            <button onClick= {handleClosePopup}>Close </button>
          </div>
        </Popup>
      )}
    </div>
    </div>
  );
};

export default SavedRecipe;
