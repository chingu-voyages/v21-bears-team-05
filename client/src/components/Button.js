import React from 'react'
import './Button.css'

const Button = ({children, onClick = () => null, className = ""}) => (
    <button onClick={onClick} className={`button ${className}`}>
        {children}
    </button>
)

export default Button