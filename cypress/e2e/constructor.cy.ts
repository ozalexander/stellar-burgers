describe('Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients'
    });
    cy.setCookie('accessToken', 'test');
    localStorage.setItem('refreshToken', 'test');
    cy.intercept('POST', 'api/orders', {
      fixture: 'order'
    });
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user'
    });
    cy.visit('localhost:4000');
  });

  describe('Add ingredients test', () => {
    it('Should add to constructor', () => {
      cy.get('[data-cy="bun"] button').click();
      cy.get('[data-cy="main"] button').click();
      cy.get('[data-cy="sauce"] button').click();
    });
  });

  describe('Modal tests', () => {
    it('Should open modal', () => {
      cy.get('[data-cy="bun"]').click();
    });
    it('Close modal by button', () => {
      cy.get('[data-cy="bun"]').click();
      cy.get('[data-cy="modal"] button').click();
    });
    it('Close modal by outside click', () => {
      cy.get('[data-cy="bun"]').click();
      cy.get('[data-cy="overlay"]').click({
        force: true
      });
    });
  });

  describe('Make order test', () => {
    it('Should create order', () => {
      cy.get('[data-cy="bun"] button').click();
      cy.get('[data-cy="main"] button').click();
      cy.get('[data-cy="sauce"] button').click();
      cy.get('[data-cy="order"] button').click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal"] h2').contains('4975');
      cy.get('[data-cy="modal"] button').click();
      cy.get('[data-cy="modal"]').should('not.exist');
      cy.get('[data-cy="order"]').contains('0');
    });
  });
  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.reload();
  });
});
