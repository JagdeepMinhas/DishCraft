import React, { useState } from 'react'
import "./Home.css"
function Home() {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    directions: '',
  });
  // to reset the form
  const handleReset = () =>{
    setRecipe({
      name:'',
      ingredients:'',
      directions:'',
    });
  };

  // to save a recipe
  const handleSave = () => {
    try {
      const existingRecipesJSON = localStorage.getItem('savedRecipes');
      const existingRecipes = existingRecipesJSON ? JSON.parse(existingRecipesJSON) : [];
  
      if (!Array.isArray(existingRecipes)) {
        throw new Error('Existing recipes is not an array.');
      }
  
      const updatedRecipes = [...existingRecipes, recipe];
  
      localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
    } catch (error) {
      console.error('Error handling save:', error);
    
    }
  };
  
   

  // to handle change
  const handleInputChange = (e) =>{
    const {name , value} = e.target;
    setRecipe((prevRecipe) =>({
      ...prevRecipe,
      [name]: value,
    }) );
  };

  return (
    <div className='home_container'>
      <form className='form'>
        <h2> Create a New Recipe</h2>
        <label>
          Recipe Name:
          <input
            type ='text'
            name ='name'
            value={recipe.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ingredients:
          <textarea className='textarea1'
            name ='ingredients'
            value={recipe.ingredients}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Directions:
          <textarea className='textarea2'
            name ='directions'
            value={recipe.directions}
            onChange={handleInputChange}
          />
        </label>
        <div>
          <button type='button' onClick={handleSave}>
            Save
          </button>
          <button type='button' onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
   
    </div>
  )
}

export default Home