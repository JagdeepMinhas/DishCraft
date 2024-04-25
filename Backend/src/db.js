const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    host: "db",
    password: "root",
    
});

const helpers = {
    createTables: async function() {
        try {
            console.log("i was here");
            const recipeTableQuery = `
                CREATE TABLE IF NOT EXISTS Recipe (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    directions TEXT NOT NULL,
                    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `;

            const ingredientTableQuery = `
                CREATE TABLE IF NOT EXISTS Ingredient (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE
                );
            `;

            const recipeIngredientTableQuery = `
                CREATE TABLE IF NOT EXISTS RecipeIngredient (
                    recipe_id INTEGER NOT NULL,
                    ingredient_id INTEGER NOT NULL,
                    PRIMARY KEY (recipe_id, ingredient_id),
                    FOREIGN KEY (recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE,
                    FOREIGN KEY (ingredient_id) REFERENCES Ingredient(id) ON DELETE CASCADE
                );
            `;

            await pool.query(recipeTableQuery);
            await pool.query(ingredientTableQuery);
            await pool.query(recipeIngredientTableQuery);
            console.log("i was here");
        } catch (error) {
            console.error("Error creating tables:", error);
        }
    },
    getRecipe: async function(recipeName) {
        try {
            const recipeRes = await pool.query('SELECT * FROM Recipe WHERE name = $1', [recipeName]);
            const recipe = recipeRes.rows[0];
         
            if (recipe) {
                const ingredientRes = await pool.query(`
                    SELECT i.name 
                    FROM Ingredient i
                    INNER JOIN RecipeIngredient ri ON i.id = ri.ingredient_id
                    WHERE ri.recipe_id = $1
                `, [recipe.id]);
                recipe.ingredients = ingredientRes.rows.map(ing => ing.name);

                return recipe;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching recipe", error);
            throw error;
        }
    },
    getAllRecipes: async function() {
        try {
            const recipesRes = await pool.query('SELECT * FROM Recipe');
            const recipes = recipesRes.rows;

            for (let recipe of recipes) {
                const ingredientRes = await pool.query(`
                    SELECT i.name 
                    FROM Ingredient i
                    INNER JOIN RecipeIngredient ri ON i.id = ri.ingredient_id
                    WHERE ri.recipe_id = $1
                `, [recipe.id]);
                recipe.ingredients = ingredientRes.rows.map(ing => ing.name);
            }

            return recipes;
        } catch (error) {
            console.error("Error fetching recipes", error);
            throw error;
        }
    },
 

addRecipe: async function(name, ingredients, directions, lastModified) {
    try {
        // Start transaction
        await pool.query('BEGIN');

        const recipeRes = await pool.query(
            'INSERT INTO Recipe(name, directions, last_modified) VALUES($1, $2, $3) RETURNING id', 
            [name, directions, lastModified]
        );
        const recipeId = recipeRes.rows[0].id;

        for (let ingredientName of ingredients) {
            let ingredientId;
            const res = await pool.query('SELECT id FROM Ingredient WHERE name = $1', [ingredientName]);

            if (res.rows.length === 0) {
                // Ingredient does not exist, so add it
                const insertIngredientRes = await pool.query('INSERT INTO Ingredient(name) VALUES($1) RETURNING id', [ingredientName]);
                ingredientId = insertIngredientRes.rows[0].id;
            } else {
                // Ingredient exists
                ingredientId = res.rows[0].id;
            }

            // Link ingredient to recipe
            await pool.query('INSERT INTO RecipeIngredient(recipe_id, ingredient_id) VALUES($1, $2)', [recipeId, ingredientId]);
        }

        // Commit transaction
        await pool.query('COMMIT');
    } catch (error) {
        // Rollback transaction in case of error
        await pool.query('ROLLBACK');
        console.error("Error adding recipe and ingredients", error);
        throw error;
    }
},

updateRecipe: async function(oldName, newIngredients, newDirections, newLastModified) {
    try {
        await pool.query('BEGIN');

        const recipeRes = await pool.query('SELECT id FROM Recipe WHERE name = $1', [oldName]);
        if (recipeRes.rows.length === 0) {
            throw new Error("Recipe not found");
        }
        const recipeId = recipeRes.rows[0].id;

        // Update the recipe
        await pool.query(
            'UPDATE Recipe SET directions = $2, last_modified = $3 WHERE id = $1',
            [recipeId, newDirections, newLastModified]
        );
        

        // Remove existing ingredient associations
        await pool.query('DELETE FROM RecipeIngredient WHERE recipe_id = $1', [recipeId]);

        // Add new ingredient associations
        for (let ingredientName of newIngredients) {
            let ingredientId;
            const res = await pool.query('SELECT id FROM Ingredient WHERE name = $1', [ingredientName]);

            if (res.rows.length === 0) {
         
                const insertIngredientRes = await pool.query('INSERT INTO Ingredient(name) VALUES($1) RETURNING id', [ingredientName]);
                ingredientId = insertIngredientRes.rows[0].id;
            } else {
            
                ingredientId = res.rows[0].id;
            }

            
            await pool.query('INSERT INTO RecipeIngredient(recipe_id, ingredient_id) VALUES($1, $2)', [recipeId, ingredientId]);
        }

        await pool.query('COMMIT');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error updating recipe", error);
        throw error;
    }
},

deleteRecipe: async function(name) {
    try {
        // Start transaction
        await pool.query('BEGIN');

        // Get the id of the recipe to be deleted
        const recipeRes = await pool.query('SELECT id FROM Recipe WHERE name = $1', [name]);
        const recipeId = recipeRes.rows[0]?.id; 

        if (!recipeId) {
            throw new Error(`Recipe with name ${name} not found`);
        }

        await pool.query('DELETE FROM Recipe WHERE id = $1', [recipeId]);

        // Remove ingredients that are no longer associated with any recipe.
    
        const orphanedIngredientsDeletionQuery = `
            DELETE FROM Ingredient 
            WHERE id NOT IN (
                SELECT DISTINCT ingredient_id 
                FROM RecipeIngredient
            );
        `;
        await pool.query(orphanedIngredientsDeletionQuery);

        // Commit transaction
        await pool.query('COMMIT');
        return await this.getAllRecipes();
    } catch (error) {
       
        await pool.query('ROLLBACK');
        console.error("Error deleting recipe and cleaning up ingredients", error);
        throw error;
    }
}



}
const obj2 = {}

module.exports = { helpers,obj2 };

