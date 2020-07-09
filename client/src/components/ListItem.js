import React from 'react'
import './ListItem.css'

const ListItem = ({ title, removeSelf, onClick, type = ''}) => (<>
    {onClick ? 
        <button className={`item item--${type}`} onClick={onClick}>
            <p className="item__title">{title}</p>
        </button> :
        <div className={`item item--${type}`}>
            <p className="item__title">{title}</p>
            {removeSelf && <button className="item__remove" onClick={removeSelf}>X</button>}
        </div> 
    }
</>)

export default ListItem