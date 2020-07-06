import React, {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import Recipe from '../components/Recipe'
import './Main.css'

const Main = () => {
  const fetchedRecipes = useRef([])
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0)
  const [pretendRecipeData, setPretendRecipeData] = useState({})
  const getRecipe = async () => {
    const recipe = await axios.get('/api/pretendRecipe')
    return recipe.data
  }
  const handlePrev = async () => {
    if (activeRecipeIndex > 0) {
        setActiveRecipeIndex(activeRecipeIndex - 1)
        setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex - 1])
    }
    return
  }
  const handleNext = async () => {
    if (fetchedRecipes.current.length - 1 <= activeRecipeIndex) {
        const recipe = await getRecipe()
        fetchedRecipes.current.push(recipe)
    } 
    setActiveRecipeIndex(activeRecipeIndex + 1)
    setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex + 1])
    return
  }
  useEffect(() => {
    getRecipe().then(recipe => {
        fetchedRecipes.current.push(recipe)
        setPretendRecipeData(fetchedRecipes.current[activeRecipeIndex])
    })
  }, [])
  return (
    <Layout>
        <section>
            <Recipe {...{pretendRecipeData}} />
        </section>
        <section>
            <button onClick={handlePrev}>Prev</button>
            <div>TODO Filters</div>
            <button onClick={handleNext}>Next</button>
        </section>
    </Layout>
  )
}

export default Main