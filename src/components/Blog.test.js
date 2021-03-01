import React from 'react'
import '@testing-library/jest-dom/extend-expect'
//Nappien paineluun ja niiden testaamiseeen
import { render, fireEvent } from '@testing-library/react'
//yksittäisen elemntin tulostamiseen consoleen
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

//----------TESTI, ETTÄ ENNEN NAPIN PAINALLUKSIA RENDERÖIDÄÄN VAIN TITLE JA AUTHOR ALKAA--------
test('RENDEROITAVA KOMPONENTTI', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Franz Kafka',
        url: 'url',
        likes: 2
    }

    const component = render(
        <Blog blog={blog} />
    )
    /*
        //Tällä saadaan debugattua componentin tuottama HTML MINGW64 konsoliin
        component.debug()
    
        //Tällä saadaan debugattua jokin haluttu elementti esi. "button"
        const li = component.container.querySelector('button')
        console.log(prettyDOM(li))
    })
    */

    //1)
    //Ensimmäinen tapa eli metodi "toHaveTextContent" siis etsii tiettyä tekstiä koko komponentin
    //renderöimästä HTML:stä. toHaveTextContent on eräs monista jest-dom-kirjaston tarjoamista
    //"matcher"-metodeista
    expect(component.container).toHaveTextContent('Franz Kafka')
    expect(component.container).toHaveTextContent('Component testing is done with react-testing-library')


    //Liket ja url ei saa oletusarvoisesti näkyä, koska vasta show napin painalluksen jälkeen tulee näkyviin
    expect(component.container).not.toHaveTextContent(2)
    expect(component.container).not.toHaveTextContent('url')
})

//---------------------NÄITÄ KAHTA EN SAANUT TOIMIMAAN------------------------------

/*
//2)
// Palauttaa sen elementin, jolla on parametrina määritelty teksti. Jos elementtiä ei ole,
//tapahtuu poikkeus. Eli mitään ekspektaatiota ei välttämättä edes tarvittaisi
//Eli hakee  renderöidystä komponentista jonkin ehdon täyttävän elementin
const element = component.getByText(
    'Component testing is done with react-testing-library'
)
expect(element).toBeDefined()
*/

/*
//3)
//Kolmas tapa on etsiä komponentin sisältä tietty elementti metodilla querySelector,
//joka saa parametrikseen CSS-selektorin.
const div = component.container.querySelector('.blog')
expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
)

})
*/
//---------------------NÄITÄ KAHTA EN SAANUT TOIMIMAAN------------------------------

//----------TESTI, ETTÄ ENNEN NAPIN PAINALLUKSIA RENDERÖIDÄÄN VAIN TITLE JA AUTHOR LOPPUU--------


//-------------TESTATAAN, ETTÄ VIEW BUTTONIN PAINAMISEN JÄLKEEN TULEE URL JA LIKES ALKAA----------
//Feikkikäyttäjä, jotta menee Blog.js:ssä if lauseiden läpi
const user = {
    username: 'atunen',
    id: '1'
}
//Tämä testiblogina
test('CLICKING SHOW BUTTON, URL AND LIKES APPEAR', async () => {
    const blog = {
        user: user,
        title: 'Component testing is done with react-testing-library',
        author: 'Franz Kafka',
        url: 'url',
        likes: 2
    }
    //Renderöidään määritelty testiblogi
    const component = render(
        <Blog blog={blog} user={user} />
    )

    //Testi hakee renderöidystä komponentista napin tekstin perusteella ja klikkaa sitä
    //Klikkaaminen tapahtuu metodin fireEvent avulla
    const button = component.getByText('view')
    fireEvent.click(button)

    //Tsekataan, että napin painalluksen jälkeen renderöiyy "url"
    expect(component.container).toHaveTextContent('url')

    //Tsekataan, että napin painalluksen jälkeen renderöiyy liketyksiä "2" kpl
    expect(component.container).toHaveTextContent(2)
})
//-------------TESTATAAN, ETTÄ VIEW BUTTONIN PAINAMISEN JÄLKEEN TULEE URL JA LIKES ALKAA----------



//--TESTATAAN, KUN LIKE-PAINIKETTA PAINETAAN KAHDESTI, TAPAHTUMAKÄSITTELIJÄFUNKTIOTA KUTSUTAAN KAHDESTI ALKAA----------


//Tämä testiblogina
test('CLICKIN LIKE BUTTON TWICE, updateBlog FUNCTION CALLED TWICE TOO', async () => {
    const blog = {
        user: user,
        title: 'Component testing is done with react-testing-library',
        author: 'Franz Kafka',
        url: 'url',
        likes: 5
    }

    //Tapahtumankäsittelijäksi annetaan Jestin avulla määritelty mock-funktio
    //Mockoliot ja -funktiot ovat testauksessa yleisesti käytettyjä valekomponentteja, 
    //joiden avulla korvataan testattavien komponenttien riippuvuuksia, 
    //eli niiden tarvitsemia muita komponentteja. 
    //Mockit mahdollistavat mm. kovakoodattujen syötteiden palauttamisen sekä niiden metodikutsujen 
    //lukumäärän sekä parametrien testauksen aikaisen tarkkailun
    const mockHandler = jest.fn()
    //Renderöidään määritelty testiblogi
    //"mockHandler" nuuskimaan "updateBlog" -funktion painamisia
    const component = render(
        <Blog blog={blog} user={user} updateBlog={mockHandler} />
    )

    //Testi hakee renderöidystä komponentista napin tekstin perusteella ja klikkaa sitä
    //Klikkaaminen tapahtuu metodin fireEvent avulla

    //Ensin avataan kaikki tiedot, niin että like button tulee myös näkyviin
    //eli painetaan "view" buttonia
    const button = component.getByText('view')
    fireEvent.click(button)

    //Painetaan like buttonia kahdesti
    const likeButtonFirstClick = component.getByText('like')
    fireEvent.click(likeButtonFirstClick)

    const likeButtonSecondClick = component.getByText('like')
    fireEvent.click(likeButtonSecondClick)

    //Tarkastetaan, että "updateBlog" funktiota on kutsuttu kahteen kertaan
    //"updateBlog" funktio on filessä "Blog.js"
    //eli että mock-funktiota on kutsuttu täsmälleen kaksi kertaa
    expect(mockHandler.mock.calls).toHaveLength(2)

})
//--TESTATAAN, KUN LIKE-PAINIKETTA PAINETAAN KAHDESTI, TAPAHTUMAKÄSITTELIJÄFUNKTIOTA KUTSUTAAN KAHDESTI LOPPUU----------
