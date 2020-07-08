import React, { useState } from 'react'
import Layout from '../components/Layout'
import IngredientsSearch from '../components/IngredientSearch'
import ItemsList from '../components/ItemsList'
import './Cupboard.css'


const Cupboard = () => {
  const [ingredientsList, setIngredientsList] = useState([])
  const handleRemoveIngredient = obj => {
    setIngredientsList(ingredientsList.filter(ingredient => JSON.stringify(ingredient) !== JSON.stringify(obj)))
  }
  const addToIngredientsList = item => {
    setIngredientsList([...new Set([...ingredientsList, item])])
  }
  return (
    <Layout>
        <div className="cupboard">
          <div className="cupboard__list"> 
            <ItemsList list={ingredientsList.map(item => ({...item, removeSelf: () => handleRemoveIngredient(item)}))} type="cupboard-item" />
          </div>
          <IngredientsSearch {...{addToIngredientsList}} />
        </div>
    </Layout>
  )
}

export default Cupboard
