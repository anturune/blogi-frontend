import React, { useState } from 'react'

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    //Cancel button ja new blog buttonit, "new blog" buttonin labeliin otetaan
    //propseina "App.js filestä" "blogForm" käsittelijästä
    // props.children, jonka avulla koodi viittaa komponentin lapsiin, eli avaavan ja 
    //sulkevan tagin sisällä määriteltyihin React-elementteihin
    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
}

export default Togglable