import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import "./Header.css";

function Header() {
  return (
    <div className='header'>
      <div className='title'>
         <h1>Recipe App</h1>
      </div>
        
        <div className='button_container'>
          <NavLink to ='/'  className={({isActive}) => isActive ? "active-class": "non-active-class" }>
             <span>New Recipe</span>
          </NavLink>
          <NavLink to ='/savedRecipes' className={({isActive}) => isActive ? "active-class": "non-active-class" }>
            <span>Saved Recipes</span>
            </NavLink>
        </div>
    </div>
  )
}

export default Header;