describe('Login user', () => {
    it('works correctly', () => {
        cy.visit('/')

        // Make sure login, register buttons exist
        cy.get('#loginUser').should('exist')
        cy.get('#registerUser').should('exist')
        cy.get('#logoutUser').should('not.exist')

        const username = Cypress.env('user1')
        const password = Cypress.env('pw1')

        // Login
        cy.get('#loginUser').click()
        cy.get('form')
        .find('input[type="email"]').type(username)
        .get('input[type="password"]').type(password)
        .get('button[type="submit"]').click()

        // Check the change in DOM occurred
        cy.get('#logoutUser').should('exist')
        cy.get('#loginUser').should('not.exist')
        cy.get('#loginUser').should('not.exist')

        // Logout
        cy.get('#logoutUser').click()

        // Make sure login button is visible again
        cy.get('#loginUser').should('exist')
        cy.get('#registerUser').should('exist')
        cy.get('#logoutUser').should('not.exist')
    })
})