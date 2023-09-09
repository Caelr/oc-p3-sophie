import { Data } from "../@types"
import Filter from "../Components/Filter"

export default class Works extends Filter{
  form: HTMLFormElement
  private gallery: HTMLElement
  private data: Data[] = []
  constructor(public api: string) {
    super()

    // Setup
    this.gallery = document.querySelector('.gallery') as HTMLElement
    this.form = document.querySelector('.filter') as HTMLFormElement
    
    this.displayWorks()
    this.addListener()
  }

  private updateUi = (data: Data[]) => {
    data.forEach(work => {
      const figure = document.createElement('figure')
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')

        image.src = work.imageUrl
        image.alt = work.title
        image.onload = () => image.classList.add('loaded')
        figcaption.innerHTML = work.title

        figure.append(image, figcaption)
        this.gallery.append(figure)
    })
  }
  private displayWorks = async () => {
    this.gallery.innerHTML = ''
    this.data = await this.getDataFromApi(`${this.api}`, 'works')
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
