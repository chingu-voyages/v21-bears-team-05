import React from 'react'
import './ListItem.css'

const ListItem = ({ name, removeSelf, onClick, type = ''}) => (<>
    {onClick ? 
        <button className={`item item--${type}`} onClick={onClick}>
            <p className="item__name">{name}</p>
        </button> :
        <div className={`item item--${type}`}>
            <p className="item__name">{name}</p>
            {removeSelf && <button className="item__remove" onClick={removeSelf}>X</button>}
        </div> 
    }
</>)

export default ListItem