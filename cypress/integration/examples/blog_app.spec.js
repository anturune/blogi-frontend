/*
describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        // ...
    })
})
*/
describe('Blog ', function () {
    //estit aloittavat samalla tavalla, eli avaamalla sivun 
    //http://localhost:3000, eristetään ennen jokaista testiä 
    //suoritettavaan beforeEach-lohkoon
    //Tyhjennetään tietokanta, luodaan testikäyttäjä ja loggaudutaan sisään
    //ennen muita testejä
    //Nyt testaus alkaa nyt myös backendin suhteen aina hallitusti samasta tilanteesta, 
    //eli tietokannassa on yksi käyttäjä ja ei yhtään blogia
    beforeEach(function () {
        //Tyhjätään tietokanta ensin
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        //Luodaan uusi käyttäjä backendissä määritellyn skeeman mukaisesti
        const user = {
            name: 'Antti Turunen',
            username: 'asturunen',
            password: 'salasana'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)

        cy.visit('http://localhost:3000')
    })

    it('FRONT PAGE CAN BE OPENED', function () {
        cy.contains('username')
    })

    it('USER CAN LOG IN', function () {
        cy.contains('login').click()
        //HUOM! #username, #login-button ja #password, nuo ovat ID:tä login formin elementeille
        //ks. "App.js" ja "const loginForm = () =>"
        //Lomakkeille kirjoittaminen metodilla "type"
        cy.get('#username').type('asturunen')
        cy.get('#password').type('salasana')
        cy.get('#login-button').click()
        cy.contains('Antti Turunen logged in')
    })

    //Testataan, että loggautuminen väärällä salasanalla ei onnistu
    it('LOGIN FAILS WITH WRONG PASSWORD', function () {
        cy.get('#username').type('asturunen')
        cy.get('#password').type('vaarasalasana')
        cy.get('#login-button').click()
        //".error":lla haetaan App.js filestä error elementti "Notification" komponentista
        cy.get('.error')
            //Shouldin käyttö on contains:iin verrattun mahdollistaa huomattavasti 
            //monipuolisemmat testit kuin pelkän tekstisisällön perusteella toimiva contains.
            //Voimme esim. varmistaa, että virheilmoituksen väri on punainen, 
            //ja että sen ympärillä on border
            .should('contain', 'Wrong username or password')
            //Varmistetaan, että error message on punaisella värillä
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')
        //Varmistetaan, että väärällä salasanalla loggauduttaessa ei löydy
        //Käyttäjän nimeä. Tässä ei saa tulla tekstiä "Antti Turunen logged in"
        cy.get('html').should('not.contain', 'Antti Turunen logged in')
    })

    describe('WHEN LOGGED IN', function () {
        //Ennen jokaista testiä loggaudutaan uudelleen suoraan tietokantakyselyllä
        //Ks. "cypress/support/commands.js" file ettei testi täytä loggautumislomakkeen kenttiä
        //joka testin alussa--> nopeampaa testata
        beforeEach(function () {
            cy.login({ username: 'asturunen', password: 'salasana' })
        })
        //Testaan uuden blogin luomista, beforeEachissa loggautuminen
        //#title, #author, #submit-button ja #url "src/components/BlogForm"
        it('a new blog can be created', function () {
            cy.contains('new blog').click()
            cy.get('#title').type('a blog created by cypress')
            cy.get('#author').type('Author Cypress')
            cy.get('#url').type('Author Cypress')
            cy.get('#submit-button').click()
            //Tällä varmistetaan, että luotu blogi tulee näkyville blogilistalle
            cy.contains('a blog created by cypress')
        })

        describe('POSSIBLE TO LIKE', function () {
            //Ennen jokaista testiä luodaan uusi blogi
            //Tässä kohtaa kun testataan liketystä, niin uuden blogin luominen tehdää
            //filestä "cypress/support/commands.js"
            beforeEach(function () {
                cy.createBlog({
                    title: 'a blog created by cypress from support/commands file',
                    author: 'Antti Turunen',
                    url: 'http://url.url'
                })

            })
            //Testataan liketystä
            it('possible to like', function () {
                //Avataan ensin koko blogin näkymä
                cy.get('#view').click()
                //Painetaan like nappia
                cy.contains('like').click()
                //Tarkastetaan, että löytyy luku 1 eli liketysten määrä
                cy.contains(1)

            })
        })
        //Testataan, että deletointi onnistuu
        describe('POSSIBLE TO DELETE', function () {
            //Ennen jokaista testiä luodaan uusi blogi
            //Tässä kohtaa kun testataan deletointua, niin uuden blogin luominen tehdää
            //filestä "cypress/support/commands.js"
            beforeEach(function () {
                cy.createBlog({
                    title: 'a blog created by cypress from support/commands file',
                    author: 'Antti Turunen',
                    url: 'http://url.url'
                })

            })
            //Testataan liketystä
            it('DELETE WORKS?', function () {
                //Avataan ensin koko blogin näkymä
                cy.get('#view').click()
                //Painetaan like nappia
                cy.contains('delete').click()
                cy.get('html').should('not.contain', 'a blog created by cypress from support/commands file')

            })
        })
        describe('SHOWN AS SORTED', function () {
            //Ennen jokaista testiä luodaan uusi blogi
            //Tässä kohtaa kun testataan deletointua, niin uuden blogin luominen tehdää
            //filestä "cypress/support/commands.js"
            beforeEach(function () {

                cy.createBlog({
                    title: 'Less Likes',
                    author: 'Toiseksi Eniten Liketyksiä',
                    url: 'http://url.url',
                    likes: 2
                })
                cy.createBlog({
                    title: 'Less Likes',
                    author: 'Eniten Liketyksiä',
                    url: 'http://url.url',
                    likes: 3
                })
                cy.createBlog({
                    title: 'Less Likes',
                    author: 'Vähiten Liketyksiä',
                    url: 'http://url.url',
                    likes: 1
                })

            })
            //Testataan, että on sortattu tykkäysten mukaisesti (suurimmasta pienimpään)
            it('SHOW AS SORTED WORKS', function () {
                //Avataan ensimmäinen blogi ja tsekataan, että sisältää eniten tykkäyksiä
                //3kpl, seuraavaksi avataan toinen jne.
                //Ensin avataan koko blogi näkyviin ja tarkastetaan, että löytyy arvo 3 sivulta
                cy.get('#view').click().then(() => {
                    // now capture it again
                    cy.contains(3)

                })
                cy.get('#view').click().then(() => {
                    // now capture it again
                    cy.contains(2)

                })
                cy.get('#view').click().then(() => {
                    // now capture it again
                    cy.contains(1)

                })
            })
        })
    })
})
