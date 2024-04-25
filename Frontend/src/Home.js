import React, { useState, useEffect } from 'react'
import "./Home.css"
import { useLocation } from 'react-router-dom';
function Home() {
  const location = useLocation();
  const initialRecipe = location.state ? location.state.recipe : { name: '', ingredients: '', directions: '',lastModified: '' };

  const [recipe, setRecipe] = useState(initialRecipe);
 
  // to reset the form
  const handleReset = () =>{
    setRecipe({
      name:'',
      ingredients:'',
      directions:'',
     last_modified: '',
    });
  };
   // Set the initial recipe when the component mounts or when the location state changes
   useEffect(() => {
    if (location.state) {
      setRecipe(location.state.recipe);
    }
  }, [location.state]);

  useEffect(() => {
    const createTables = async () => {
      try {
        const response = await fetch('http://localhost:8080/', { method: 'GET' });
        const result = await response.text(); 
        console.log(result);
      } catch (error) {
        console.error('Error creating tables:', error);
      }
    };

    createTables(); 
  }, []);
  // Automatically set or update thelast_modified field to current date
  const updatedRecipe = {
    ...recipe,
   last_modified: new Date().toISOString(), 
  };
  // to save or Update recipe
  const handleSaveOrUpdate = async () => {
    try {
      if (!recipe.name || !recipe.directions || !recipe.ingredients) {
        alert("Please fill in all fields before saving ");
        return;
      }
  
      const endpoint = location.state && location.state.recipe
        ? `http://localhost:8080/update-recipe`
        : 'http://localhost:8080/add-recipe';
  
      const method = location.state && location.state.recipe ? 'PUT' : 'POST';
  
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });
   
      if (response.ok) {
        alert(location.state && location.state.recipe ? 'Recipe updated successfully' : 'Recipe saved successfully');
        handleReset();
      } else {
        alert('Failed to save/update Recipe');
      }
    } catch (error) {
      console.error('Error Saving/Updating recipe:', error);
    }
  };
  
  
   

  // to handle change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (location.state && name === 'name') {
      alert('You cannot update the name of an existing recipe. Please create a new recipe with a different name.');
      return;
    }

    if (name === 'ingredients') {
      const ingredientsArray = value.split(',').map((ingredient) => ingredient.trim());
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: ingredientsArray,
      }));
    } else {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        [name]: value,
      }));
    }
  };
  return (
    <div className='home_container'>
      <form className='form'>
      <h2>{location.state ? 'Edit Recipe' : 'Create a New Recipe'}</h2>
        <label>
          Recipe Name:
          <input
            type ='text'
            name ='name'
            value={recipe.name}
            onChange={handleInputChange}
            readOnly={!!location.state} 
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
          <button type='button' onClick={handleSaveOrUpdate}>
          {location.state ? 'Update' : 'Save'}
          </button>
          {!location.state &&(
          <button type='button' onClick={handleReset}>
            Reset
          </button>
          )}
        </div>
      </form>
   
    </div>
  )
}

export default Home