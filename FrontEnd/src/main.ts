import Works from "./Classes/Works"
import Authentication from "./Components/Authentication"
import Filter from "./Components/Filter"

class App {
  private works!: Works
  pages!: { [key: string]: Works }
  path: string
  page!: typeof this.pages[keyof typeof this.pages]
  authentication!: Authentication
  
  constructor() {
    this.path = window.location.pathname
    this.createGallery()
    this.createAuth()
  }
  createGallery = () => {
    if (this.path === '/') {
      this.works = new Works('http://localhost:5678/api/')
    }
  }


  createAuth = () => {
    if (this.path === '/login.html') {
      this.authentication = new Authentication({api:'http://localhost:5678/api/', endpoint:'users/login'})
    }
  }

}

new App()
