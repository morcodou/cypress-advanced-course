describe('Hacker Stories - UI (Mocking API)', () => {
  const initialTerm = 'React'
  // const newTerm = 'Cypress'

  beforeEach(() => {
    cy.intercept('GET', `**/search?query=${initialTerm}&page=0`, { fixture: 'stories' })
      .as('getstories')

    cy.visit('/')
    cy.wait('@getstories')
  })

  context('List of stories', () => {
    // 'shows only nineteen stories after dimissing the first story'
    it('shows one less history after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 1)
    })
  })
})
