describe('Hacker Stories - E2E (API)', () => {
  const initialTerm = 'React'
  const newTerm = 'Cypress'

  beforeEach(() => {
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

  context('List of stories', () => {
    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept('GET', '**/search?query=React&page=1')
        .as('getmorestories')

      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()

      cy.wait('@getmorestories')

      cy.get('.item').should('have.length', 40)
    })
  })

  context('Search', () => {
    context('Last searches', () => {
      it('searches via the last searched term', () => {
        cy.intercept('GET', `**/search?query=${newTerm}&page=0`)
          .as('getsearchstories')

        cy.get('#search')
          .clear()
          .type(`${newTerm}{enter}`)

        cy.wait('@getsearchstories')

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.wait('@getstories')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })
    })
  })
})
