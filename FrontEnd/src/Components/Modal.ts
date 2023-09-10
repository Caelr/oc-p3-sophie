import { Data } from "../@types"

export default class Modal {
  elements: {
    modal: HTMLDialogElement
    addButton: HTMLButtonElement
    portfolioTitle: HTMLElement
    open: HTMLButtonElement
    close: HTMLButtonElement
  }
  constructor() {

  }

  createModalGallery = () => {
    const data = localStorage.getItem('works')
    if(!data) return
    const works: Data[] = JSON.parse(data)

    const modalGallery = document.createElement('div')

    works.forEach(work => {
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
      document.body.style.overflow = 'hidden'
    })
    this.elements.close.addEventListener('click', () => {
      this.elements.modal.close()
      document.body.style.overflow = 'auto'
    })

  }
}
