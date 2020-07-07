import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import './Recipe.css'

export const GET_RECIPE = gql`
  query GetRecipe {
    pretendRecipe {
      colour
      title
      ingredients
    }
  }
`

const Recipe = () => {
  const { loading, error, data } = useQuery(GET_RECIPE)
  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <div style={{background: data.pretendRecipe.colour}}>
        <h1>{data.pretendRecipe.title}</h1>
        <p>With {data.pretendRecipe.ingredients}</p>
    </div>
  )
}

export default Recipe