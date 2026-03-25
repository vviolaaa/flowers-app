describe('Wildflower App', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('shows the header', () => {
        cy.get('.header-container').should('be.visible');
        cy.get('h1').should('contain', 'Imagine that smth cool'); // ← full text
    });

    it('shows login button when not logged in', () => {
        cy.get('.header-btn.login').should('contain', 'Login / Sign up');
    });

    it('opens auth modal when login button is clicked', () => {
        cy.get('.header-btn.login').click(); // ← added dot
        cy.get('.auth-modal').should('be.visible');
        cy.get('h4').should('contain', 'Welcome!');
    });

    it('shows error with wrong credentials', () => {
        cy.get('.header-btn.login').click();
        cy.get('input[type="email"]').type('wrong@email.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('.auth-submit').click();
        cy.get('.auth-error').should('be.visible');
    });

    it('can register a new user', () => {
    const uniqueEmail = `test${Date.now()}@test.com`;
    cy.get('.header-btn.login').click();
    cy.get('.auth-tab').contains('Register').click();
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('input[placeholder="Email"]').type(uniqueEmail);
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.get('.auth-submit').click();
    cy.get('.header-username').should('contain', 'testuser');
});

    it('can navigate to flowers section', () => {
        cy.contains('Flowers').click();
        cy.get('.flowers-container').should('be.visible');
    });

    it('can browse flowers with arrow buttons', () => {
    cy.contains('Flowers').click();
    cy.get('.flower-choosing-box img')
        .should('have.attr', 'src', '/flowersPngs/flower1.png');
    cy.get('#forward-button').click({ force: true }); // ← force click
    cy.get('.flower-choosing-box img')
        .should('have.attr', 'src', '/flowersPngs/flower2.png');
});

    it('opens flower modal on click', () => {
        cy.contains('Flowers').click();
        cy.get('.flower-choosing-box').click(); // ← added dot
        cy.get('.modal-content').should('be.visible'); // ← added dot
        cy.contains('Decorate your flower!').should('be.visible');
    });

    it('closes flower modal when cancel is clicked', () => {
        cy.contains('Flowers').click();
        cy.get('.flower-choosing-box').click(); // ← added dot
        cy.get('.close-btn').click(); // ← added dot
        cy.get('.modal-content').should('not.exist'); // ← added dot
    });

    it('shows auth modal when saving without login', () => {
        cy.contains('Flowers').click();
        cy.get('.flower-choosing-box').click(); // ← added dot
        cy.get('.save-btn').click(); // ← added dot
        cy.get('.auth-modal').should('be.visible'); // ← added dot
    });

    it('can log out', () => {
        cy.get('.header-btn.login').click();
        cy.get('input[type="email"]').type('test@test.com');
        cy.get('input[type="password"]').type('password123');
        cy.get('.auth-submit').click();
        cy.get('.header-btn.logout').click();
        cy.get('.header-btn.login').should('be.visible');
    });

});