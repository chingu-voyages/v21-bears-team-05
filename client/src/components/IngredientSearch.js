import React, { useRef, useState } from 'react'
import { search, getCatagories } from '../services/ingredientsDB'
import ListItem from './ListItem'
import CatagoryItem from './CatagoryItem'
import 'IngredientSearch.css'

const IngredientSearch = ({ingredientsList, setIngredientsList}) => {
    const catagories = useRef(getCatagories())
    const [query, setQuery] = useState("")
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [results, setResults] = useState([])
    const inputRef = useRef()
    const handleQuery = () => {
        const value = inputRef.current.value
        setQuery(value)
        const matches = search(value)
        if (matches?.length > 0) {
            setResults(matches)
        }
    }
    const handleRemoveIngredient = (title) => {
        setIngredientsList(ingredientsList.filter(ingredient => ingredient !== title))
    }
    useState(() => {
        if (results?.length === 0 && catagories.current) {
            setResults(catagories.current.filter(catagory => catagory.level === 0))
        }
    }, [results])
    return (
        <div className="ingredient-search">
            <div className="ingredient-search__bucket">
                { ingredientsList.map(({title}) => (
                     <ListItem 
                        key={"bucket__item--"+title} 
                        {...{
                            title, 
                            removeSelf: () => handleRemoveIngredient(title)}} 
                        />)
                )}
            </div>
            <div className="ingredient-search__query">
                { breadcrumbs.map((breadcrumb) => (
                    <ListItem 
                        key={"ingredient-search__breadcrumb--"+breadcrumb.title} 
                        {...{
                            title: breadcrumb.title, 
                            onClick: () => handleAddBreadcrumb(() => setBreadcrumbs([...breadcrumbs, breadcrumb])) 
                        }}
                    />)
                )}
                <input className="ingredient-search__input" onChange={handleQuery} value={query} ref={inputRef} />
            </div>
            <div className="ingredient-search__results">
                {results.map(result => (
                    result.isCatagory ? 
                        <CatagoryItem 
                            {...{
                                title: result.title,
                                onClick: () => handleAddBreadcrumb(() => setBreadcrumbs([...breadcrumbs, breadcrumb]))
                            }} 
                        /> :
                        <ListItem 
                        key={"bucket__item--"+title} 
                        {...{
                            title, 
                            removeSelf: () => handleRemoveIngredient(title)}} 
                        />)
                )}
            </div>
        </div>
    )
}

export default IngredientSearch