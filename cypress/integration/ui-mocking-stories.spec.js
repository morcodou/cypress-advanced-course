describe('Hacker Stories - UI (Mocking API)', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  context('List of stories', () => {
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
        .click()

      cy.get('.item').should('have.length', 1)
    })

    it.only('shows the right data for all rendered stories', () => {
      const stories = require('../fixtures/stories.json')

      cy.get('.item').as('items')
      cy.get('@items')
        .first()
        .should('be.visible')
        .should('contain', stories.hits[0].title)
        .and('contain', stories.hits[0].author)
        .and('contain', stories.hits[0].num_comments)
      cy.get(`.item a:contains(${stories.hits[0].title})`)
        .should('have.attr', 'href', stories.hits[0].url)

      cy.get('@items')
        .last()
        .should('be.visible')
        .should('contain', stories.hits[1].title)
        .and('contain', stories.hits[1].author)
        .and('contain', stories.hits[1].num_comments)
      cy.get(`.item a:contains(${stories.hits[1].title})`)
        .should('have.attr', 'href', stories.hits[1].url)
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
        .clear()
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.wait('@getsearchstories')

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
        .click()

      cy.wait('@getsearchstories')

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
          cy.get('#search')
            .clear()
            .type(`${faker.random.word()}{enter}`)
          cy.wait('@getrandomstories')
        })

        // cy.wait('@getrandomstories')

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})
