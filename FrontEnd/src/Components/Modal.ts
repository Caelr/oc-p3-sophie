import { Data } from "../@types"

export default class Modal {
  elements: {
    modal: HTMLDialogElement
    addButton: HTMLButtonElement
    portfolioTitle: HTMLElement
    open: HTMLButtonElement
    close: HTMLButtonElement
  }
  works: Data[]
  constructor() {

  }

  createModalGallery = () => {
    const data = localStorage.getItem('works')
    if(!data) return
    this.works = JSON.parse(data)

    const modalGallery = document.createElement('div')

    this.works.forEach(work => {
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const deleteButton = document.createElement('button')
      modalGallery.classList.add('modal__gallery')
      figure.classList.add('modal__media')
      image.classList.add('modal__media__image')
      image.src = work.imageUrl
      image.alt = work.title
      deleteButton.classList.add('modal__delete')

      figure.append(image, deleteButton)
      modalGallery.appendChild(figure)
    })
    this.elements.modal.insertBefore(modalGallery, this.elements.addButton)
  }

  createModalForm = () => {
    // const modalForm = document.createElement('form')
    // const uploadInput = document.createElement('input')
    // const nameInput = document.createElement('input')
    // const categoryInput = document.createElement('input')

    // uploadInput.type = 'file'
    // uploadInput.accept = 'image/jpg'

  }

  create = () => {
    this.elements = {
      modal: document.querySelector('.modal') as HTMLDialogElement,
      addButton: document.querySelector('.modal__button') as HTMLButtonElement,
      portfolioTitle: document.querySelector('.portfolio__title') as HTMLElement,
      open: document.querySelector('.portfolio__edit') as HTMLButtonElement,
      close: document.querySelector('.close__modal') as HTMLButtonElement
    }

    this.createModalGallery()
    this.elements.portfolioTitle.style.marginBlockEnd = '92px'
  }

  addListener = () => {
    this.elements.open.addEventListener('click', () => {
      this.elements.modal.showModal()

    })

    this.elements.close.addEventListener('click', () => {
      this.elements.modal.close()
    })

    this.elements.modal.addEventListener('click', (e) => {
      const target = e.target
      if (!(target instanceof HTMLButtonElement)) return
      const figure = target.closest('.modal__media')
      figure?.remove()
    })

  }
}
