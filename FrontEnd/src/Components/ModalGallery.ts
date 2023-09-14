import { Data } from "../@types"

export default class ModalGallery {
  elements: {
    modal: HTMLDialogElement
    addButton: HTMLButtonElement
  }
  gallery: HTMLElement
  private token: string
  public works: Data[]
  constructor() {

  }

  create = () => {
    this.gallery = document.createElement('div')
    const authToken = localStorage.getItem('authToken')
    if (!authToken) return
    this.token = JSON.parse(authToken)
  }
  createGallery = async (modal: HTMLDialogElement, addButton: HTMLButtonElement) => {
    this.gallery.innerHTML = ''
    this.works = await window.home.getApiData()
    this.works.forEach(work => {
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const deleteButton = document.createElement('button')
      this.gallery.classList.add('modal__gallery')
      figure.classList.add('modal__media')
      figure.dataset.id = `${work.id}`
      image.classList.add('modal__media__image')
      image.src = work.imageUrl
      image.alt = work.title
      deleteButton.classList.add('modal__delete')
      deleteButton.dataset.id = `${work.id}`

      figure.append(image, deleteButton)
      this.gallery.appendChild(figure)
    })
    modal.insertBefore(this.gallery, addButton)
  }

  delete = async (id: number, token: string) => {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    })
    if (response.ok) {
      console.log('ok')
    }
  }
  addListeners = () => {
    this.gallery.addEventListener('click', async (event) => {
      const target = event.target
      if (!(target instanceof HTMLButtonElement)) return
      const imageId = target.dataset.id

      const worksToRemove: HTMLElement[] = Array.from(document.querySelectorAll(`[data-id='${imageId}']`))
      worksToRemove.forEach(work => {
        if (!work.dataset.id) return
        this.delete(+work.dataset.id, this.token)
        work.remove()
      })
      this.works = await window.home.getApiData()
      localStorage.setItem('works', JSON.stringify(this.works))
    })
  }

}
