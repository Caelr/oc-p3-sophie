import Home from "./Pages/Home"
import Login from "./Pages/Login"

class App {
  private path: string
  private home: Home
  private login: Login
  private pages: {[key: string]: Home | Login}
  private page: typeof this.pages[keyof typeof this.pages]

  constructor() {
    this.path = window.location.pathname

    this.createPages()
  }

  createPages = () => {
    this.home = new Home()
    this.login = new Login()
    this.pages = {
      '/': this.home,
      '/login.html': this.login
    }
    this.page = this.pages[this.path]
  }
}

new App()
