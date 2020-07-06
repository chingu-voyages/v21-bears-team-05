import React, { useState } from 'react'
import logo from '../logo.svg'
import './Landing.css'
import { Redirect } from 'react-router-dom'

const Landing = () => {
  const [redirect, setRedirect] = useState(null)
  const signIn = () => {
    setRedirect(<Redirect to='/main/' />)
  }
  return (
    <div className="landing">
      {redirect}
      <header className="landing__header">
        <img src={logo} className="landing__logo" alt="logo" />
      </header>
      <main>
          <button className="landing__signin" onClick={signIn}>Google Signin (TODO)</button>
      </main>
    </div>
  )
}

export default Landing
