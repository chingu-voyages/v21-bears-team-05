import React, {useState, useRef, useEffect} from 'react'
import Layout from '../components/Layout'
import Recipe from '../components/Recipe'
import './Main.css'

const Main = () => {
  return (
    <Layout>
        <section>
            <Recipe />
        </section>
        <section>
            <button>Prev</button>
            <div>TODO Filters</div>
            <button>Next</button>
        </section>
    </Layout>
  )
}

export default Main