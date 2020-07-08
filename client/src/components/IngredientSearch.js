import React, { useRef, useState, useEffect, useCallback } from 'react'
import { searchIngredients, getCatagories } from '../services/ingredientsDB.mjs'
import ItemsList from './ItemsList'
import ListItem from './ListItem'
import './IngredientSearch.css'

const IngredientSearch = ({addToIngredientsList}) => {
    const [query, setQuery] = useState("")
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const [catagories, setCatagories] = useState(getCatagories())
    const [results, setResults] = useState([])
    const inputRef = useRef()
    const handleQuery = useCallback( () => {
        const value = inputRef.current.value
        setQuery(value)
        const matches = searchIngredients(value, breadcrumbs.map(({title}) => title))
        setResults(matches.filter(({isCatagory}) => !isCatagory))
        setCatagories(matches.filter(({isCatagory}) => isCatagory))
    }, [breadcrumbs])
    const handleKeyPress = e => {
        if (e.key === "Backspace" && query === "" && breadcrumbs.length > 0) {
            setBreadcrumbs(breadcrumbs.slice(0, breadcrumbs.length-1))
        }
        if (e.key === "Enter") {
            inputRef.current.blur()
        }
    }
    const handleAddBreadcrumb = item => {
        setBreadcrumbs([...breadcrumbs, item])
        setQuery("")
        inputRef.current.focus()
    }
    const clearSearch = () => {
        setBreadcrumbs([])
        inputRef.current.value = ""
        handleQuery()
    }
    useEffect(() => {
        if (breadcrumbs.length > 0) {
            handleQuery()
        }
    }, [breadcrumbs, handleQuery])
    useEffect(() => {
        if (breadcrumbs.length === 0 && query === "") {
            setCatagories(getCatagories())
        }
    }, [query, breadcrumbs])
    return (
        <div className="ingredient-search">
            <div className="ingredient-search__query">
                <ItemsList list={breadcrumbs.map(item => ({...item}))} type="breadcrumb" />
                <input className="ingredient-search__input" onChange={handleQuery} value={query} ref={inputRef} onKeyDown={handleKeyPress} />
                <button onClick={clearSearch}>X</button>
            </div>
            <div className="ingredient-search__catagories">
                {catagories.map(result => (
                        <ListItem
                            key={"results__catagory--"+result.title} 
                            {...{
                                ...result,
                                onClick: () => handleAddBreadcrumb(result)
                            }} 
                            type="catagory"
                        /> 
                    )
                )}
            </div>
            <div className="ingredient-search__results">
                {results.map(result => (
                    result.isCatagory ? 
                        <ListItem
                            key={"results__catagory--"+result.title} 
                            {...{
                                ...result,
                                onClick: () => setBreadcrumbs([...breadcrumbs, result])
                            }} 
                            type="results__catagory"
                        /> :
                        <ListItem 
                            key={"results__ingredient--"+result.title} 
                            {...{
                                ...result, 
                                onClick: () => addToIngredientsList(result)
                            }}
                            type="results__ingredient"
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default IngredientSearch