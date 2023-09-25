import Home from './Pages/Home.js'
import Login from './Pages/Login.js'

class App {
  constructor() {
    this.api = 'http://localhost:5678/api/'
    this.path = window.location.pathname
    this.addListeners()
    this.createPages(this.api)
  }

  createPages(api) {
    this.home = new Home({
      api,
      endpoint: 'works',
    })
    this.login = new Login({
      api,
      endpoint: 'users/login',
    })
    this.pages = {
      '/': this.home,
      '/login.html': this.login,
    }
    this.page = this.pages[this.path]
  }

  /**
   * Adds event listeners when the DOM is ready.
   */
  addListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.page) {
        this.page.create()
        this.page.addListener()
      }
    })
  }
}

new App()
