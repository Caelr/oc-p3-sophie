import { Data } from '../@types'
export default class Home {

  private elements: {
    gallery: HTMLElement
    form: HTMLFormElement
    portfolio: HTMLElement
    section: HTMLElement
    edition: HTMLAnchorElement
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

  private showGallery = (works: Data[]) => {
    this.elements.gallery.innerHTML = ''
    works.forEach((work) => {
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

  private initUi = (works: Data[]) => {
    if (!this.isAuth) {
      this.filters.forEach(filter => {
        // Setup
        const galleryFilter = document.createElement('p')
        const input = document.createElement('input')
        const label = document.createElement('label')

        galleryFilter.classList.add('gallery__filter')

        input.type = 'radio'
        input.name = 'filter'
        input.value = `${filter}`
        input.id = `${filter.toLowerCase().slice(0, 4)}`
        input.value === this.filterValue ? input.checked = true : ''

        label.htmlFor = input.id
        label.innerText = `${filter}`
        galleryFilter.append(input, label)
        this.elements.form.append(galleryFilter)
      })
    } else {
      this.elements.edition.style.display = 'flex'
    }
    this.showGallery(works)
  }

  private getApiData = async () => {
    const response = await fetch(`${this.api}${this.endpoint}`)
    const data: Data[] = await response.json()
    localStorage.setItem('works', JSON.stringify(data))
    return data
  }

  create = async () => {
    this.elements = {
      gallery: document.querySelector('.gallery') as HTMLElement,
      form:document.querySelector('.filter') as HTMLFormElement,
      portfolio: document.getElementById('portfolio') as HTMLElement,
      section: document.getElementById('portfolio') as HTMLElement,
      edition: document.querySelector('.portfolio__edit') as HTMLAnchorElement
    }



    localStorage.getItem('authToken') !== null
      ? (this.isAuth = true)
      : (this.isAuth = false)

    const works = localStorage.getItem('works')
    if (!works) return

    this.data = await this.getApiData()
    this.initUi(this.data)
  }

  private update = async () => {
    const data = localStorage.getItem('works')
    if (!data) return
    const works: Data[] = JSON.parse(data)
    if (this.filterValue === 'Tous' || this.isAuth) {
      this.showGallery(works)
      return
    }
    const filteredData = works.filter(
      (work) => work.category.name === this.filterValue
    )

    this.showGallery(filteredData)
  }

  addListener = () => {
    this.elements.form.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof HTMLInputElement)) return
      this.filterValue = target.value as typeof this.filterValue
      this.update()
    })
  }
}
