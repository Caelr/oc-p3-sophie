type Data = {
  id: number,
  title: string
  imageUrl: string
  categoryId: number,
  userId: number,
  category: {
    id: number,
    name: string
  }
}
export default class Works {
  private data: Data[] = []
  private gallery: HTMLElement
  constructor(public api: string) {
    // Setup
    this.api = api
    this.gallery = document.querySelector('.gallery') as HTMLElement

    this.displayWorks()
  }

  private fetchWorks = async (endpoint: string) => {
    const response = await fetch(`${this.api}${endpoint}`)
    const data: Data[] = await response.json()
    return data
  }

  private displayWorks = async () => {
    this.gallery.innerHTML = ''
    this.data = await this.fetchWorks('works')
    this.data.forEach(work => {
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const figcaption = document.createElement('figcaption')

      image.src = work.imageUrl
      image.alt = work.title
      figcaption.innerHTML = work.title

      figure.append(image, figcaption)
      this.gallery.append(figure)
    })

  }
}
