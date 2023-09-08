import Works from "./Classes/Works"
import Filter from "./Components/Filter"

class App {
  private works
  private filter
  constructor() {
    this.works = new Works('http://localhost:5678/api/')
    this.filter = new Filter()
  }

}

new App()
