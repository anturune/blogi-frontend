import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> UPDATES PARENT STATE AND CALLS onSubmit', () => {
    const createBlog = jest.fn()

    //Huom! createBlog jest.fn() kutsuu tapahtumakäsittelijäfunktiota
    //"BlogForm.js" filestä "addBlog":n alta "createBlogia", joka tulee propseina
    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    //Näillä haetaan elementit "BlogForm.js" filestä, elementin id:n perusteella
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    //Tässä haetaan elementti "BlogForm.js" filestä nimen perusteella
    const form = component.container.querySelector('form')

    //Määritellään input kentille arvot
    fireEvent.change(title, {
        target: {
            value: 'testing of forms could be easier'
        }
    })
    fireEvent.change(author, {
        target: {
            value: 'Antti Antinen'
        }
    })

    fireEvent.change(url, {
        target: {
            value: 'http://url.url'
        }
    })
    //Submitoidaan lomake eli painetaan create nappia
    fireEvent.submit(form)
    //Testataan, että "createBlog":a on kutsuttu filessä "BlogForm.js" yhden kerran
    expect(createBlog.mock.calls.length).toBe(1)
    //console.log('MITÄ TÄÄLTÄ TULEE ULOS',JSON.stringify(createBlog.mock.calls[0][0].author, null, 2))
    //tapahtumankäsittelijää kutsutaan oikealla parametrilla, eli että luoduksi tulee saman sisältöinen 
    //title blogille kuin lomakkeelle kirjoitetaan
    expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier')
})