import { Data } from '../@types'
export default class Home {
  private element: HTMLElement
  private elements: {
    gallery: HTMLElement
    form: HTMLFormElement
    portfolio: HTMLElement
  }

  private api: string
  private endpoint: string

  private isAuth: boolean
  private data: Data[]
  private filters = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'] as const
  private filterValue: typeof this.filters[number]

  constructor({ api, endpoint }: { api: string; endpoint: string }) {
    this.filterValue = 'Tous'
    this.api = api
    this.endpoint = endpoint
  }

  private updateUi = (data: Data[]) => {
    if (this.isAuth) {
      const change = document.createElement('a')
      change.href = '/'
      change.innerHTML = 'Hello'
      this.elements.portfolio.closest('h2')?.append(change)
    } else {
      const form = document.createElement('form')
      form.classList.add('filter')
      this.filters.forEach(filter => {
        // Setup
        const galleryFilter = document.createElement('p')
        const input = document.createElement('input')
        const label = document.createElement('label')

        input.type = 'radio'
        input.name = 'filter'
        input.value = `${filter}`
        input.id = `${filter.toLowerCase().slice(0, 4)}`


        galleryFilter.append(input, label)
        form.append(galleryFilter)
      })
      form.innerHTML = `
      <form class="filter">
        <p class="gallery__filter">
          <input type="radio" name="filter" value="Tous" id="all" checked>
          <label for="all">Tous</label>
        </p>
        <p class="gallery__filter">
          <input type="radio" name="filter" value="Objets" id="object">
          <label for="object">Objets</label>
        </p>
        <p class="gallery__filter">
          <input type="radio" name="filter" value="Appartements" id="apartment">
          <label for="apartment">Appartements</label>
        </p>
        <p class="gallery__filter">
          <input type="radio" name="filter" value="Hotels & restaurants" id="hotel">
          <label for="hotel">Hôtels & restaurants</label>
        </p>
      </form>`
    }
    data.forEach((work) => {
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const figcaption = document.createElement('figcaption')

      image.src = work.imageUrl
      image.alt = work.title
      image.onload = () => image.classList.add('loaded')
      figcaption.innerHTML = work.title

      figure.append(image, figcaption)
      this.elements.gallery.append(figure)
    })
  }

  private getApiData = async () => {
    const response = await fetch(`${this.api}${this.endpoint}`)
    const data: Data[] = await response.json()

    if (this.filterValue === 'Tous' || this.isAuth) return data
    const filteredData = data.filter(
      (work) => work.category.name === this.filterValue
    )
    return filteredData
  }

  create = async () => {
    this.element = document.querySelector('.home') as HTMLElement
    this.elements = {
      gallery: document.querySelector('.gallery') as HTMLElement,
      form: document.querySelector('.filter') as HTMLFormElement,
      portfolio: document.getElementById('portfolio') as HTMLElement,
    }
    localStorage.getItem('authToken') !== null
      ? (this.isAuth = true)
      : (this.isAuth = false)

    this.data = await this.getApiData()
    this.elements.gallery.innerHTML = ''
    this.updateUi(this.data)

  }

  private displayWorks = async () => {
    this.elements.gallery.innerHTML = ''
    this.data = await this.filter.getDataFromApi(`${this.api}`, 'works')
    this.updateUi(this.data)
  }

  addListener = () => {
    this.form.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof HTMLInputElement)) return
      this.inputValue = target.value
      this.displayWorks()
    })
  }
}
