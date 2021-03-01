import React, { useState } from 'react'


//Sisältää liketysten päivityksen ja päivitys tietokantaan
//tehdään updateBlog komponentilla, joka tuodaan tähän "updateBlog:lla"
//HUOM! App.js filessä olevassa updateBlog komponentissa on mukana id:n vastaanottokin
const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  //Blogin tila, joka määrittelee kumpi return palautetaan
  const [view, setView] = useState(false)

  //Tämä muuttaa blogin tilaa eli määärää sen kumpa return palautetaan
  const toggleVisibility = () => {
    if (!view) {
      setView(true)
    }
    else if (view) {
      setView(false)
    }
  }

  //-------------------LIKETYSTEN PÄIVITTÄMINEN ALKAA--------------------------
  //Tässä käytetään parametria "updateBlog", jonka toiminnallisuus on App.js filessä
  //HUOM! App.js:ssä oleva "updateBlog" komponentti sisältää myös blogin ID:n syöttömahdollisuuden
  //ja se on tässä toisena parametrina. Eka on "blogobjectin sisältö" ja toinen on "blogin ID"
  const likes = () => {
    updateBlog({
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }, blog.id)

    //console.log('BLOGIN ID', blog.id)
  }
  //-------------------LIKETYSTEN PÄIVITTÄMINEN LOPPUU---------------------------

  //-------------------BLOGIN DELETOINTI ALKAA-----------------------------------
  //Blogin deletointiin riittää pelkkä ID:n lähettäminen "src/services/blogs.js" fileen
  const blogDeletion = () => {
    deleteBlog(blog)
  }
  //-------------------BLOGIN DELETOINTI LOPPUU------------------------------------


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
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>view</button>
        </div>
      </div>
    )
  }


  //Näytetään kaikki blogin tiedot, jos on painettu view nappia
  //Hide napilla sitten uudelleen piiloon

  else if (view && blog.user.username !== user.username) {
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
          <button onClick={likes}>like</button>
          <br></br>
          Author: {blog.author}
        </div>
      </div>
    )
  }

  //HUOM! Delete nappi lisätty ja näkyviin vain kun blogin luoja
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
          <button onClick={likes}>like</button>
          <br></br>
          Author: {blog.author}
        </div>
        <div>
          <button onClick={blogDeletion}>delete</button>
        </div>
      </div>
    )
  }
}

export default Blog