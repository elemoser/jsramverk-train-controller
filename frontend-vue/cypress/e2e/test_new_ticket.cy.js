describe('Check "train" in Session Storage', () => {
    it('displays TicketView', () => {
        cy.visit('/');

        // Save train number in the first element
        let trainNumber

        cy.get('.train-number').first().then(($element) => {
            trainNumber = $element.text()
            expect(trainNumber).to.exist

            // Navigate to the TicketView
            cy.get('.delayed-trains')
            .find('div').first().click()

            // Select option ANA031
            cy.get('select').select('ANA031 - Kort tåg')

            // Submit choice
            cy.get('input[type="submit"]').click()

            // Ticket list
            cy.get('.old-tickets').find('div').last().should('exist')

            cy.get('.old-tickets').find('div').last().invoke('text').should('include', 'ANA031');

            cy.get('.old-tickets').find('div').last().should('contain', trainNumber);
        });
    });
});