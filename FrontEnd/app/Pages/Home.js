import Modal from '../Components/Modal.js'

export default class Home {
  constructor({ api, endpoint }) {
    window.home = this
    this.filters = ['Tous']
    this.filterValue = 'Tous'
    this.api = api
    this.endpoint = endpoint
  }

  getFilters = async () => {
    const response = await fetch(`${this.api}categories`)
    const categories = await response.json()
    categories.forEach((category) => this.filters.push(category.name))
  }
  /**
   * Fetches works data from the API.
   */
  getApiData = async () => {
    const response = await fetch(`${this.api}${this.endpoint}`)
    const data = await response.json()
    return data
  }

  /**
   * Show works in the gallery
   */

  showGallery = (works) => {
    this.elements.gallery.innerHTML = ''
    works.forEach((work) => {
      // Setup gallery
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const figcaption = document.createElement('figcaption')

      // Attributes
      figure.dataset.id = `${work.id}`
      figure.dataset.category = `${work.category.name}`
      image.src = work.imageUrl
      image.alt = work.title
      image.onload = () => image.classList.add('loaded')
      figcaption.innerHTML = work.title

      // Adding to the DOM
      figure.append(image, figcaption)
      this.elements.gallery.append(figure)
    })
  }

  /**
   * Create filter form
   */

  createFilter = () => {
    const form = document.createElement('form')
    form.classList.add('filter')
    return form
  }

  /**
   * Initializes the user interface.
   */
  initUi = async (works) => {
    await this.getFilters()
    if (!this.isAuth) {
      // Add filter
      this.filters.forEach((filter) => {
        // Setup
        const galleryFilter = document.createElement('p')
        const input = document.createElement('input')
        const label = document.createElement('label')

        galleryFilter.classList.add('gallery__filter')

        input.type = 'radio'
        input.name = 'filter'
        input.value = `${filter}`
        input.id = `${filter.toLowerCase().slice(0, 4)}`
        input.value === this.filterValue ? (input.checked = true) : ''

        label.htmlFor = input.id
        filter === 'Hotels & restaurants' ? label.innerText = 'Hôtels & restaurants' : label.innerText = `${filter}`
        galleryFilter.append(input, label)

        if (!this.elements.filter) return
        this.elements.filter.append(galleryFilter)
      })
      this.elements.section.insertBefore(
        this.elements.filter,
        this.elements.gallery
      )
    } else {
      this.elements.edition.style.display = 'flex'
      this.elements.banner.style.display = 'block'
      this.modal = new Modal(this.api, this.endpoint, this.works)
      this.modal.create()
      this.modal.addListener()
    }
    this.createNavigation()
    this.showGallery(works)
  }

  /**
   * Sets up storage and initializes the user interface.
   */
  setupStorageAndUi = async () => {
    localStorage.getItem('authToken') !== null
      ? (this.isAuth = true)
      : (this.isAuth = false)

    const data = await this.getApiData()
    localStorage.setItem('works', JSON.stringify(data))
    this.initUi(data)
    const localData = localStorage.getItem('works')
    if (!localData) return
    this.works = JSON.parse(localData)
  }

  /**
   * Creates the Home page.
   */
  create = () => {
    this.elements = {
      gallery: document.querySelector('.gallery'),
      filter: this.createFilter(),
      portfolio: document.getElementById('portfolio'),
      section: document.getElementById('portfolio'),
      edition: document.querySelector('.portfolio__edit'),
      banner: document.querySelector('.edition'),
      login: document.querySelector('.logout'),
    }

    this.setupStorageAndUi()
  }

  /**
   * Updates the gallery based on the selected filter.
   */
  update = () => {
    const toShow = Array.from(this.elements.gallery.children)
    toShow.forEach((element) => {
      if (this.filterValue === 'Tous') {
        element.style.display = 'block'
        return
      }
      element.dataset.category !== this.filterValue
        ? (element.style.display = 'none')
        : (element.style.display = 'block')
    })
  }

  createNavigation = () => {
    this.navigation = document.querySelector('.navigation')
    if (this.isAuth) {
      this.navigation.innerHTML = `
      <ul>
        <li><a href="#portfolio">projets</a></li>
        <li><a href="#contact">contact</a></li>
        <li><a class="logout" href="/">logout</a></li>
        <li><a href="https://instagram.com" target="_blank"><img src="./assets/icons/instagram.png" alt="Instagram"></a></li>
      </ul>
      `

      document.querySelector('.logout').addEventListener('click', (event) => {
        event.preventDefault()
        this.isAuth = false
        localStorage.removeItem('authToken')
        location.reload()
      })

    } else {
      this.navigation.innerHTML = `
      <ul>
        <li><a href="#portfolio">projets</a></li>
        <li><a href="#contact">contact</a></li>
        <li><a class="login" href="login.html">login</a></li>
        <li><a href="https://instagram.com" target="_blank"><img src="./assets/icons/instagram.png" alt="Instagram"></a></li>
      </ul>
      `
    }

  }

  /**
   * Handles the click event on the filter.
   */
  clickHandler = (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    this.filterValue = target.value
    this.update()
  }

  /**
   * Adds event listener for filter clicks.
   */
  addListener = () => {
    this.elements.filter.addEventListener('click', this.clickHandler)
  }
}
