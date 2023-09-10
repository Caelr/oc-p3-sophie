import Home from "./Pages/Home"
import Login from "./Pages/Login"

class App {
  private path: string
  private api: string
  private home: Home
  private login: Login
  private pages: {[key: string]: Home | Login}
  private page: typeof this.pages[keyof typeof this.pages]

  constructor() {
    this.api = 'http://localhost:5678/api/'
    this.path = window.location.pathname
    this.addListeners()

    this.createPages(this.api)
  }

  createPages = (api: string) => {
    this.home = new Home({
      api,
      endpoint: 'works',
    })

    this.login = new Login({
      api,
      endpoint: 'users/login'
    })

    this.pages = {
      '/': this.home,
      '/login.html': this.login
    }

    this.page = this.pages[this.path]
  }

  addListeners = () => {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.page) {
        this.page.create()
        this.page.addListener()
      }
    })
  }
}

new App()
