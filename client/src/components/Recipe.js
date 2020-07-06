import React from 'react'
import './Recipe.css'

const Recipe = ({pretendRecipeData = {colour: "black", title: "", ingredients: ""}}) => {
  return (
    <div style={{background: pretendRecipeData.colour}}>
        <h1>{pretendRecipeData.title}</h1>
        <p>With {pretendRecipeData.ingredients}</p>
    </div>
  )
}

export default Recipe