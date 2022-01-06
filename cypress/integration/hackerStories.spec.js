describe('Hacker Stories', () => {
  beforeEach(() => {
    // cy.intercept('GET', '**/search?query=React&page=0')
    //   .as('getstories');

    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
      }
    }).as('getstories')

    cy.visit('/')
    cy.wait('@getstories')
  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('shows the right data for all rendered stories', () => { })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => { })

      it('orders by author', () => { })

      it('orders by comments', () => { })

      it('orders by points', () => { })
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.intercept('GET', `**/search?query=${newTerm}&page=0`)
        .as('getsearchstories')

      cy.get('#search')
        .clear()
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.wait('@getsearchstories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      // cy.get('form input[type="text"]')
      //   .should('be.visible')
      //   .clear()
      //   .type(newTerm)
      // cy.get('form').submit()

      cy.wait('@getsearchstories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and submits the form directly', () => {
      // search
      // cy.get('form input[id="search"]')
      cy.get('form input[type="text"]')
        .should('be.visible')
        .clear()
        .type(newTerm)
      cy.get('form').submit()

      cy.wait('@getsearchstories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    context('Last searches', () => {
      it('shows a max of 5 buttons for the last searched terms', () => {
        const faker = require('faker')

        cy.intercept('GET', '**/search?query=**')
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
