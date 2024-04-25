const express = require('express');
const app = express();
const port = 8080;
const db = require('./src/db')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors()); 
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

 app.get('/', async (req, res) =>{
    await db.helpers.createTables()
    res.send("Tables created suncessfully")
 })

 

app.post('/add-recipe', async (req, res) => {
   let name = req.body.name
   let ingredients = req.body.ingredients
   let directions = req.body.directions
   let last_modified = req.body.last_modified
    await db.helpers.addRecipe(name, ingredients, directions, last_modified)
   return res.json({ message: 'recipe added' }) 
})

app.get('/get-recipe-name', async(req ,res) => {
  let name = req.body.name
  let p = await db.helpers.getRecipe(name)
  console.log(p)
  return res.json(p)
})

app.get('/get-all-recipe', async(req ,res) => {
  let p = await db.helpers.getAllRecipes()
  return res.json(p)
})

app.delete('/delete-recipe', async(req,res) =>{
  let name = req.body.name
  let updatedRecipes = await db.helpers.deleteRecipe(name)
  res.json({ message: 'Recipe deleted sucessfully', updatedRecipes })
}) 

app.put('/update-recipe', async(req, res)=>{
  let name = req.body.name
  let ingredients = req.body.ingredients
  let directions = req.body.directions
  let last_modified = req.body.last_modified
  await db.helpers.updateRecipe(name, ingredients,directions, last_modified)
  return res.json({ message: 'recipe updated' }) 
})
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});