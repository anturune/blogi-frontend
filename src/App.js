import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import './index.css'
import blogService from './services/blogs'
//Login pyyntö 
import loginService from './services/login'


//Tällä muotoillaan notificaatio errorille
//CSS filestä muotoilua
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const NotificationBlogAdded = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="added">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  //Tilat usernamelle ja salasanalle
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  //Tilat notificaatioille
  const [errorMessage, setErrorMessage] = useState(null)
  const [addedMessage, setAddedMessage] = useState(null)

  //Uuden blogin luomiseen liittyvien kenttien ylläpitoon
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')


  //Effect hook hakemaan kaikki blogit kun sivu ladataan
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )

  }, [])


  //Effect hook hakemaan locla storagesta loggautuneen käyttäjän tiedot
  //ettei pyydä sivun uudelleen latauksen yhteydessä uudelleen kirjautumaan
  //Efektin lopuussa parametrina oleva tyhjä taulukko "[]" varmistaa sen, että efekti suoritetaan 
  //ainoastaan kun komponentti renderöidään ensimmäistä kertaa
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  //----------------------- LOGOUT JA LOGIN-----------------------------------
  //Kirjautumislomakkeen lähettämisestä vastaava metodi
  const handleLogin = async (event) => {
    event.preventDefault()
    //console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      //Kirjautuneen käyttäjän tiedot local storageen, jotta pysyy aktiivisena
      //koko session ajan eikä esim. sivun uudelleen lataamisen yhteydessä pyydä
      //kirjautumaan uudelleen
      //Käyttäjän tietoja pystyy nyt tarkastella selaimen konsolista
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      console.log('LOGGAUTUNUT KÄYTTÄJÄ', user)
      //Lisätään käyttäjän token saataville "services/blogs.js" fileen
      //missä mm. tehdään http post pyyntö palvelimelle uuden blogin lisäämiseksi
      blogService.setToken(user.token)
      setUser(user)
      //Nollataan kirjautumislomakkeen kentät, kun login nappia painettu
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //Tämä sitä varten, että voidaan renderöidä ehdollisesti eli jos ei ole loggautunut
  //Näytetään login formi, muutoin blogiformi
  const loginForm = () => (

    <form onSubmit={handleLogin}>
      <div>
        <h2>Login to apllication</h2>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
  //Logout napin lähettämisestä vastaava metodi
  const handleLogout = (event) => {
    //Pitää tyhjätä selaimen loclastoragesta käyttäjä, jottei sivua uudelleen
    //ladattaessa taas olla loggautuneena
    window.localStorage.clear()
    //Tyhjätään token
    blogService.setToken('')
    //Tyhjätään käyttäjä
    setUser(null)
  }
  //Logoutnapin renderöinti
  const logoutForm = () => (
    <button onClick={handleLogout}>logout</button>
  )

  //----------------------- LOGOUT JA LOGIN LOPPUU-----------------------------------

  //-----------------UUDEN BLOGIN LUOMINEN-------------------------------------------

  //Title kentän muutoksien hallintaan
  const handleTitleChange = (event) => {
    //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
    //event.target.value viittaa inputin syötekentän arvoon
    console.log(event.target.value.toLowerCase())
    //Täydennetään uutta titteliä sitä mukaan kuin kenttään kirjoitetaan
    setNewTitle(event.target.value)
  }

  //Author kentän muutoksien hallintaan
  const handleAuthorChange = (event) => {
    //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
    //event.target.value viittaa inputin syötekentän arvoon
    console.log(event.target.value.toLowerCase())
    //Täydennetään uutta titteliä sitä mukaan kuin kenttään kirjoitetaan
    setNewAuthor(event.target.value)
  }
  //Url kentän muutoksien hallintaan
  const handleUrlChange = (event) => {
    //Tapahtumaolion kenttä target vastaa kontrolloitua input-kenttää.
    //event.target.value viittaa inputin syötekentän arvoon
    console.log(event.target.value.toLowerCase())
    //Täydennetään uutta titteliä sitä mukaan kuin kenttään kirjoitetaan
    setNewUrl(event.target.value)
  }

  const addBlog = async (event) => {
    //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
    //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
    event.preventDefault()
    console.log('UUSI BLOGI ON SYNTYMÄSSÄ')

    //Luodaan uusi blogi object
    //token on jo saatavilla "services/blogs.js" filessä, koska token
    //meni sinne local storage effect hookin kautta

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    //Viedään käyttäjän token "services/blogs" fileen, jossa uuden blogin
    blogService.setToken(user.token)

    try {
      //Luodaan blogi kantaan HUOM! async/await
      await blogService.createBlog(blogObject)

      //Haetaan kaikki blogit kannasta uuden lisäyksen jälkeen
      //HUOM! async/await
      const blogsAfterAdd = await blogService.getAll()

      //Päivitetään näytettävää blogilistaa sis. uuden blogin
      setBlogs(blogsAfterAdd.map(blog => blog))

      //Onnistuneesta lisäyksestä selaimeen viesti 5 sec
      setAddedMessage('A new blog ' + `${blogObject.title}` + ' by ' + `${user.name}` + ' successfully added')
      setTimeout(() => {
        setAddedMessage(null)
      }, 5000)
      //Jos lisääminen ei onnistu, annetaan herja käyttäjälle
    } catch (exception) {
      setErrorMessage('Jokin meni pieleen')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  //Uuden blogin luomiseen renderöity formi
  const blogForm = () => (
    < div >
      <h2>CREATE NEW</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: <input value={newTitle} onChange={handleTitleChange} />
        </div>
        <div>
          Author: <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          Url: <input value={newUrl} onChange={handleUrlChange} />
        </div>
        <br></br>
        <button type="submit">create</button>
      </form>
    </div >
  )
  //-----------------UUDEN BLOGIN LUOMINEN LOPPUU-------------------------------------------

  return (
    <div>

      <Notification message={errorMessage} />
      <NotificationBlogAdded message={addedMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in {logoutForm()}</p>
          {blogForm()}

          <h2>YOUR BLOGS</h2>
          {blogs.filter(blog => blog.user.username === user.username).map(blog =>
            <Blog key={blog.id} blog={blog} />)}
        </div>
      }
    </div>
  )
}

export default App