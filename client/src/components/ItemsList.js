import React from 'react'
import ListItem from './ListItem'

const ItemsList = ({list, type}) => {
  return (
    <> 
        { list.map((item) => (<ListItem key={`${type}__item--${JSON.stringify(item)}`} { ...{...item, type} } />)) }
    </>
  )
}

export default ItemsList
