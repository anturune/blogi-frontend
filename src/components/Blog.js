import React, { useState } from 'react'



const Blog = ({ blog }) => {
  //Blogin tila, joka määrittelee kumpi return palautetaan
  const [view, setView] = useState(false)

  //Tämä muuttaa blogin tilaa eli mitä näytetään
  const toggleVisibility = () => {
    if (!view) {
      setView(true)
    }
    else if (view) {
      setView(false)
    }
  }

  const likes = () => {
    console.log('lisaa liketysta')
  }

  //Ulkoasun muokkaukseen. Kehä ympärille jokaiselle blogille
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  //Näytetään vain blogin title, jos ei ole painettu view nappia
  if (!view) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
    )
  }
  //Näytetään kaikki blogin tiedot, jos on painettu view nappia
  else if (view) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
          <br></br>
          likes: {blog.likes}
          <button value={blog} onClick={likes}>like</button>
          <br></br>
          Author: {blog.author}
        </div>
      </div>
    )
  }
}

export default Blog