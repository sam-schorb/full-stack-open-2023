describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = { name: 'Kipper', username: 'kipper', password: 'kipper123' }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('button').contains('login').click() // Assuming 'Log in' is the text on the button
    cy.contains('username')
    cy.contains('password')
    cy.get('button').contains('login')
  })

  it('succeeds with correct credentials', function() {
    cy.get('button').contains('login').click()

    // wait for the form to appear
    cy.get('form').should('be.visible')
    cy.get('input[id="username"]').type('kipper')
    cy.get('input[id="password"]').type('kipper123')
    cy.get('button[id="login-button"]').click()

    cy.contains('Kipper logged in')
  })

  it('fails with wrong credentials and error message is shown', function() {
    cy.get('button').contains('login').click()

    cy.get('form').should('be.visible')
    cy.get('input[id="username"]').type('kipper')
    cy.get('input[id="password"]').type('wrong')
    cy.get('button[id="login-button"]').click()


    cy.get('.notification')
      .should('contain', 'Wrong credentials')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'kipper', password: 'kipper123' })
    })

    it('A blog can be created', function() {
      cy.contains('new note').click()
      cy.get('input#title').type('Test Blog')
      cy.get('input#author').type('Test Author')
      cy.get('input#url').type('http://testurl.com')
      cy.get('button[type="submit"]').click()

      cy.contains('Test Blog Test Author')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'Test Blog', author: 'Test Author', url: 'http://testurl.com' })
      })

      it('it can be liked', function () {
        cy.contains('Test Blog Test Author').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('.likeButton').click()

        cy.get('.likes').should('contain', 'likes: 1')
      })

      it('it can be deleted by the user who created it', function () {
        cy.contains('Test Blog Test Author').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('.deleteButton').click()

        cy.get('html').should('not.contain', 'Test Blog Test Author')
      })

      it('it cannot be deleted by other users', function () {
        const user = { name: 'Another User', username: 'test', password: 'secret' }
        cy.request('POST', 'http://localhost:3001/api/login', { username, password })
        cy.login({ username: 'test', password: 'secret' })

        cy.contains('Test Blog Test Author').parent().find('button').as('viewButton')
        cy.get('@viewButton').click()
        cy.get('html').should('not.contain', '.deleteButton')
      })
    })
  })



})
