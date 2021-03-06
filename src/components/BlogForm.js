import React, { useState } from 'react'

//Uuden blogiin liittyvät tilankäsittelijät
const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')

    //Hallitsee title kentässä olevat muutokset
    const handleTitleChange = (event) => {
        //console.log('HandleTitleChange', event.target.value.toLowerCase())
        setNewTitle(event.target.value)
    }

    //Hallitsee Author kentässä olevat muutokset
    const handleAuthorChange = (event) => {
        //console.log('HandleAuthorChange', event.target.value.toLowerCase())
        setNewAuthor(event.target.value)
    }
    //Hallitsee url kentässä olevat muutokset
    const handleUrlChange = (event) => {
        //console.log('HandleURLChange', event.target.value.toLowerCase())
        setNewUrl(event.target.value)
    }
    //Alla olvassa "onSubmit" -käskyssä viittaus tänne
    const addBlog = (event) => {
        event.preventDefault()
        //console.log('TULIKO TÄNNE')
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
        })
        //Tyhjätään luonnin jälkeen kentät title, author ja Url
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
    }


    return (
        < div >
            <h2>CREATE NEW BLOG</h2>
            <form onSubmit={addBlog}>
                <div>
                    Title: <input id='title' value={newTitle} onChange={handleTitleChange} />
                </div>
                <div>
                    Author: <input id='author' value={newAuthor} onChange={handleAuthorChange} />
                </div>
                <div>
                    Url: <input id='url' value={newUrl} onChange={handleUrlChange} />
                </div>
                <br></br>
                <button id='submit-button' type="submit">create</button>
            </form>
        </div >
    )
}
export default BlogForm