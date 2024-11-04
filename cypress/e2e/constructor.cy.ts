import * as ingredients from '../fixtures/ingredients.json';

describe('Constructor', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients'
    });
    cy.setCookie('accessToken', 'test');
    localStorage.setItem('refreshToken', 'test');
    cy.intercept('POST', 'api/orders', {
      fixture: 'order',
      delay: 1000
    });
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user'
    });
    cy.visit('localhost:4000');
  });

  describe('Add ingredients test', () => {
    it('Should add to constructor and check', () => {
      cy.get('[data-cy="constructor"]').should(
        'not.contain',
        ingredients.data[0].name
      );
      cy.get('[data-cy="bun"]:first-of-type button').click();
      cy.get('[data-cy="constructor"]').contains(ingredients.data[0].name);
      cy.get('[data-cy="constructor"]').should(
        'not.contain',
        ingredients.data[1].name
      );
      cy.get('[data-cy="main"]:first-of-type button').click();
      cy.get('[data-cy="constructor"]').contains(ingredients.data[1].name);
      cy.get('[data-cy="constructor"]').should(
        'not.contain',
        ingredients.data[2].name
      );
      cy.get('[data-cy="sauce"]:first-of-type button').click();
      cy.get('[data-cy="constructor"]').contains(ingredients.data[2].name);
    });
  });

  describe('Modal tests', () => {
    it('Should open modal', () => {
      cy.get('[data-cy="modal"]').should('not.exist');
      // modal closed
      cy.get('[data-cy="bun"]:first-of-type').click();
      cy.get('[data-cy="modal"]').should('be.visible');
      // modal opened
      cy.get('[data-cy="modal"]').should((modal) => {
        expect(modal).to.contain(ingredients.data[0].name);
        expect(modal).to.contain(ingredients.data[0].calories);
        expect(modal).to.contain(ingredients.data[0].proteins);
        expect(modal).to.contain(ingredients.data[0].fat);
        expect(modal).to.contain(ingredients.data[0].carbohydrates);
      });
      // has all the parameters
      cy.get('[data-cy="modal"] img').should(
        'have.attr',
        'src',
        ingredients.data[0].image_large
      );
      // has correct image
    });
    it('Should close modal by button', () => {
      cy.get('[data-cy="bun"]:first-of-type').click();
      cy.get('[data-cy="modal"]:first-of-type button').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });
    it('Should close modal by outside click', () => {
      cy.get('[data-cy="bun"]:first-of-type').click();
      cy.get('[data-cy="overlay"]').click({
        force: true
      });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Make order test', () => {
    it('Should create order', () => {
      cy.get('[data-cy="order"] button').should('be.disabled');
      // order button disabled
      cy.get('[data-cy="bun"]:first-of-type button').click();
      cy.get('[data-cy="main"]:first-of-type button').click();
      cy.get('[data-cy="sauce"]:first-of-type button').click();
      // tested above
      cy.get('[data-cy="order"] button').should('not.be.disabled');
      // order button enabled
      cy.get('[data-cy="constructor"]').should('not.contain', 'Выберите булки');
      cy.get('[data-cy="constructor"]').should(
        'not.contain',
        'Выберите начинку'
      );
      // constructor is full
      cy.get('[data-cy="order"] button').click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal"] h3').contains('Оформляем заказ...');
      // waiting for response
      cy.get('[data-cy="modal"] h2').contains('4975');
      cy.get('[data-cy="modal"]:first-of-type button').click();
      cy.get('[data-cy="modal"]').should('not.exist');
      cy.get('[data-cy="order"]').contains('0');
      // order is created
      cy.get('[data-cy="order"] button').should('be.disabled');
      cy.get('[data-cy="constructor"]').contains('Выберите начинку');
      cy.get('[data-cy="constructor"]').contains('Выберите булки');
      // constructor is empty and order button is disabled
    });
  });
  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
    cy.reload();
  });
});
