import { Data } from '../@types'
import Modal from '../Components/Modal'

// Todo Change this to a singleton
declare global {
  interface Window {
    home: Home
  }
}

export default class Home {
  elements: {
    gallery: HTMLElement
    filter: HTMLFormElement
    portfolio: HTMLElement
    section: HTMLElement
    edition: HTMLAnchorElement
    banner: HTMLElement
  }

  private modal: Modal
  private api: string
  private endpoint: string

  private isAuth: boolean

  private works: Data[]

  private filters = [
    'Tous',
    'Objets',
    'Appartements',
    'Hotels & restaurants',
  ] as const

  private filterValue: (typeof this.filters)[number]

  constructor({ api, endpoint }: { api: string; endpoint: string }) {
    // Todo Change this to a singleton
    window.home = this

    this.filterValue = 'Tous'
    this.api = api
    this.endpoint = endpoint
  }

  private showGallery = (works: Data[]) => {
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
  private filteredGallery = (works: Data[]) => {
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

  private createFilter = () => {
    const form = document.createElement('form')
    form.classList.add('filter')
    return form
  }

  private initUi = (works: Data[]) => {
    if (!this.isAuth) {
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
        label.innerText = `${filter}`
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
    this.showGallery(works)
  }

  // ? Fetch works Data
  private getApiData = async () => {
    const response = await fetch(`${this.api}${this.endpoint}`)
    const data: Data[] = await response.json()
    return data
  }

  private setupStorageAndUi = async () => {
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

  create = () => {
    this.elements = {
      gallery: document.querySelector('.gallery') as HTMLElement,
      filter: this.createFilter(),
      portfolio: document.getElementById('portfolio') as HTMLElement,
      section: document.getElementById('portfolio') as HTMLElement,
      edition: document.querySelector('.portfolio__edit') as HTMLAnchorElement,
      banner: document.querySelector('.edition') as HTMLElement,
    }

    this.setupStorageAndUi()
  }

  private update = () => {

    const toShow: HTMLElement[] = Array.from(this.elements.gallery.children) as HTMLElement[]
    toShow.forEach(element => {
      if (this.filterValue === 'Tous') {
        element.style.display = 'block'
        return
      }
      element.dataset.category !== this.filterValue ? element.style.display = 'none': element.style.display = 'block'
    })
  }

  private clickHandler = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    this.filterValue = target.value as typeof this.filterValue
    this.update()

  }

  addListener = () => {
    this.elements.filter.addEventListener('click', this.clickHandler)
  }
}
