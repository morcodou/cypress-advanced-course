describe('Hacker Stories - Loading', () => {

    it('shows a "Loading ..." state before showing the results', () => {

        cy.intercept('GET', `**/search?query=***`,
            {
                delay: 1000,
                fixture: 'stories'
            }
        ).as('getdelaystories')

        cy.visit('/')
        cy.assertLoadingIsShownAndHidden()
        cy.wait('@getdelaystories')

        cy.get('.item').should('have.length', 2)
    })
})