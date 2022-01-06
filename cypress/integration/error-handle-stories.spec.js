describe('Hacker Stories Errors', () => {

  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(
      'GET',
      '**/search?query=**',
      {
        statusCode: 500
      }
    ).as('servererror');

    cy.visit('/');

    cy.wait('@servererror');

    cy.get('p:contains(Something went wrong ...)')
      .should('be.visible');
    cy.get('.item').should('have.length', 0)
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(
      'GET',
      '**/search?query=**',
      {
        forceNetworkError: true
      }
    ).as('networkerror');

    cy.visit('/');

    cy.wait('@networkerror');

    cy.get('p:contains(Something went wrong ...)')
      .should('be.visible');
    cy.get('.item').should('have.length', 0);
  })
  
})
