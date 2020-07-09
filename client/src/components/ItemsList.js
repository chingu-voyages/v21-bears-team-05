import React from 'react'
import ListItem from './ListItem'

const ItemsList = ({list, type}) => {
  return (
    <> 
        { list.map((item) => (<ListItem key={`${type}__item--${item.title}`} { ...{...item, type} } />)) }
    </>
  )
}

export default ItemsList
