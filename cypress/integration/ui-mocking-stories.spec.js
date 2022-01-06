describe('Hacker Stories - UI (Mocking API)', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  context('List of stories', () => {
    const stories = require('../fixtures/stories.json')

    beforeEach(() => {
      cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, { fixture: 'stories' })
        .as('getstories')

      cy.visit('/')
      cy.wait('@getstories')
    })

    // 'shows only nineteen stories after dimissing the first story'
    it('shows one less history after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .should('be.visible')
        .click()

      cy.get('.item').should('have.length', 1)
    })

    it('shows the right data for all rendered stories', () => {
      cy.get('.item')
        .first()
        .should('be.visible')
        .should('contain', stories.hits[0].title)
        .and('contain', stories.hits[0].author)
        .and('contain', stories.hits[0].num_comments)
      cy.get(`.item a:contains(${stories.hits[0].title})`)
        .should('have.attr', 'href', stories.hits[0].url)

      cy.get('.item')
        .last()
        .should('be.visible')
        .should('contain', stories.hits[1].title)
        .and('contain', stories.hits[1].author)
        .and('contain', stories.hits[1].num_comments)
      cy.get(`.item a:contains(${stories.hits[1].title})`)
        .should('have.attr', 'href', stories.hits[1].url)
    })

    context('Order by', () => {
      it('orders by title', () => {
        cy.get('.list-header-button')
          .contains('Title')
          .as('titleheader')

        cy.get('@titleheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('be.visible')
          .should('contain', stories.hits[0].title)

        cy.get('@titleheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[1].title)
      })

      it('orders by author', () => {
        cy.get('.list-header-button')
          .contains('Author')
          .as('authorheader')

        cy.get('@authorheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[0].author)

        cy.get('@authorheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[1].author)
      })

      it('orders by comments', () => {
        cy.get('.list-header-button')
          .contains('Comments')
          .as('commentsheader')

        cy.get('@commentsheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[1].num_comments)

        cy.get('@commentsheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[0].num_comments)
      })

      it('orders by points', () => {
        cy.get('.list-header-button')
          .contains('Points')
          .as('pointsheader')

        cy.get('@pointsheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[1].points)

        cy.get('@pointsheader')
          .should('be.visible')
          .click()

        cy.get('.item')
          .first()
          .should('contain', stories.hits[0].points)
      })
    })
  })

  context('Search', () => {
    beforeEach(() => {
      cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, { hits: [] })
        .as('getstories')
      cy.intercept('GET', `**/search?query=${newTerm}&page=0`, { fixture: 'stories' })
        .as('getsearchstories')

      cy.visit('/')
      cy.wait('@getstories')

      cy.get('#search')
        .should('be.visible')
        .clear()
    })

    it('shows no story when none is returned', () => {
      cy.get('.item').should('not.exist')
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .should('be.visible')
        .type(`${newTerm}{enter}`)

      cy.wait('@getsearchstories')
      cy.getLocalStorage('search')
        .should('equal', newTerm)

      cy.get('.item').should('have.length', 2)
      cy.get('.item')
        .first()
      // .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .should('be.visible')
        .click()

      cy.wait('@getsearchstories')

      cy.getLocalStorage('search')
        .should('equal', newTerm)

      cy.get('.item').should('have.length', 2)
      cy.get('.item')
        .first()
      // .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('shows a max of 5 buttons for the last searched terms', () => {
        const faker = require('faker')

        cy.intercept('GET', '**/search?query=**', { fixture: 'stories' })
          .as('getrandomstories')

        Cypress._.times(6, () => {
          const randomSearch = faker.random.word()
          cy.get('#search')
            .clear()
            .type(`${randomSearch}{enter}`)
          cy.wait('@getrandomstories')

          cy.getLocalStorage('search')
            .should('equal', randomSearch)
        })

        // cy.wait('@getrandomstories')

        // cy.get('.last-searches button')
        //   .should('have.length', 5)

        cy.get('.last-searches')
          .within(() => {
            cy.get('button')
              .should('be.visible')
              .and('have.length', 5)
          })
      })
    })
  })
})
