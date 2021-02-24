import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import './index.css'
import blogService from './services/blogs'
//Login pyyntö 
import loginService from './services/login'
//Buttonien näkyvyyttä säätelemään
import Togglable from './components/Togglable'


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
  const addBlog = async (blogObject) => {
    //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
    //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
    //event.preventDefault()
    console.log('UUSI BLOGI ON SYNTYMÄSSÄ')

    //Piilotetaan luomislomake kutsumalla noteFormRef.current.toggleVisibility() 
    //samalla kun uuden muistiinpanon luominen tapahtuu
    blogFormRef.current.toggleVisibility()

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

  }

  //-----------------UUDEN BLOGIN LUOMINEN LOPPUU-------------------------------------------

  //-----------------LIKETYKSEN LISÄÄMINEN ALKAA-------------------------------------------

  const updateBlog = async (blogObject,id) => {
    //Estää lomakkeen lähetyksen oletusarvoisen toiminnan, 
    //joka aiheuttaisi mm. sivun uudelleenlatautumisen. 
    //event.preventDefault()
    console.log('UUSI BLOGI ON PÄIVITTYMÄSSÄ JA SEN ID',id)

    /*
    //Piilotetaan luomislomake kutsumalla noteFormRef.current.toggleVisibility() 
    //samalla kun uuden muistiinpanon luominen tapahtuu
    blogFormRef.current.toggleVisibility()

    //Viedään käyttäjän token "services/blogs" fileen, jossa uuden blogin
    blogService.setToken(user.token)
*/
    try {
      //Luodaan blogi kantaan HUOM! async/await
      await blogService.updateBlog(blogObject,id)

      //Haetaan kaikki blogit kannasta uuden lisäyksen jälkeen
      //HUOM! async/await
      const blogsAfterUpdate = await blogService.getAll()

      //Päivitetään näytettävää blogilistaa sis. uuden blogin
      setBlogs(blogsAfterUpdate.map(blog => blog))

      //Onnistuneesta lisäyksestä selaimeen viesti 5 sec
      setAddedMessage('A blog ' + `${blogObject.title}` + ' by ' + `${user.name}` + ' successfully updated')
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

  }

  //-----------------LIKETYKSEN LISÄÄMINEN LOPPUU-------------------------------------------


  //----------------UUDEN BLOGIN LUOMINEN KUN BLOGIN FORMI NÄYTETÄÄN VAIN HALUTESSA ALKAA------------
  //useRef hookilla luodaan ref blogFormRef, joka kiinnitetään blogin luomislomakkeen sisältävälle 
  //Togglable-komponentille. Nyt siis muuttuja blogFormRef toimii viitteenä komponenttiin.
  const blogFormRef = useRef()

  //Renderöitävä blogiformi ja tähän liittyvä komponentti
  //"src/components/blogform", Create Button käyttöön vain halutessa
  //Ja buttonin nimeksi tulee "new blog" ks. Togglable ja BlogForm komponentit
  //käytössä on nyt avaava ja sulkeva tagi, joiden sisällä määritellään toinen 
  //komponentti eli LoginForm
  //Togglablen avaavan ja sulkevan tagin sisälle voi sijoittaa lapsiksi mitä 
  //tahansa React-elementtejä
  //blogFormRef:llä luomislomakkeen sulkeminen luonnin jälkeen
  const blogForm = () => (
    <Togglable buttonLabel="new blog" hideLabel="cancel" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  //Blogien renderöintiin. "components/Blog.js" renderöidään show ja hide napit
  //joilla saa valittua mitä blogista näytetään
  const showHide = () => (
    blogs.filter(blog => blog.user.username === user.username).map(blog =>
      <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
    ))
  //----------------UUDEN BLOGIN LUOMINEN KUN BLOGIN FORMI NÄYTETÄÄN VAIN HALUTESSA LOPPUU------------
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
          {showHide()}

        </div>
      }
    </div>
  )
}

export default App