import React from 'react'

//Bogin luomisen formi eristetty tänne, omaan komponenttiin
const BlogForm = ({
    addBlog,
    newTitle,
    handleTitleChange,
    newAuthor,
    handleAuthorChange,
    newUrl,
    handleUrlChange }) => {
    return (
        < div >
            <h2>CREATE NEW BLOG</h2>
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
}
export default BlogForm