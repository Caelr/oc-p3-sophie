import Works from "./Classes/Works"
import Filter from "./Components/Filter"

class App {
  private works
  constructor() {
    this.works = new Works('http://localhost:5678/api/')
  }

}

new App()
