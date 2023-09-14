import { Data } from '../@types'
import NewWork from '../Classes/NewWork'
import ModalGallery from './ModalGallery'
export default class Modal {
  newWork: NewWork
  modalGallery: ModalGallery

  elements: {
    modal: HTMLDialogElement
    title: HTMLHeadingElement
    addButton: HTMLButtonElement
    portfolioTitle: HTMLElement
    open: HTMLButtonElement
    close: HTMLButtonElement
    back: HTMLButtonElement
  }

  constructor(
    public api: string,
    public endpoint: string,
    public works: Data[]
  ) {
    this.api = api
    this.endpoint = endpoint
    this.works = works
    this.newWork = new NewWork(this.api, this.endpoint, this.works)
    this.modalGallery = new ModalGallery()
  }

  create = () => {
    this.elements = {
      modal: document.querySelector('.modal') as HTMLDialogElement,
      title: document.querySelector('.modal__title') as HTMLHeadingElement,
      addButton: document.querySelector('.modal__button') as HTMLButtonElement,
      portfolioTitle: document.querySelector(
        '.portfolio__title'
      ) as HTMLElement,
      open: document.querySelector('.portfolio__edit') as HTMLButtonElement,
      close: document.querySelector('.close__modal') as HTMLButtonElement,
      back: document.querySelector('.back__modal') as HTMLButtonElement,
    }
    this.newWork.create()
    this.modalGallery.create()
    this.elements.portfolioTitle.style.marginBlockEnd = '92px'
  }

  handleAddButton = () => {
    this.elements.addButton.style.display = 'none'
    this.elements.back.style.opacity = '1'
    this.modalGallery.gallery.style.display = 'none'
    this.elements.title.innerHTML = 'Ajout photo'
    this.newWork.elements.form.style.display = 'grid'
    this.newWork.addListener()

    this.newWork.elements.form.addEventListener('submit', (event) => {
      this.newWork.handleWorkSubmit(event)
      this.newWork.elements.inputCategory.value = ''
      this.newWork.elements.inputTitle.value = ''
      this.newWork.elements.inputUpload.value = ''
      this.elements.addButton.style.display = 'block'
      this.elements.back.style.opacity = '0'
      this.modalGallery.gallery.style.display = 'grid'
      this.elements.title.innerHTML = 'Galerie photo'
      this.newWork.elements.form.style.display = 'none'
      this.newWork.removeListener()
      this.elements.modal.close()
    })
  }

  handleBackButton = () => {
    this.elements.addButton.style.display = 'block'
    this.elements.back.style.opacity = '0'
    this.modalGallery.gallery.style.display = 'grid'
    this.elements.title.innerHTML = 'Galerie photo'
    this.newWork.elements.form.style.display = 'none'
    this.newWork.removeListener()
  }

  handleCloseButton = () => {
    this.elements.back.removeEventListener('click', this.handleBackButton)
    this.elements.addButton.removeEventListener('click', this.handleAddButton)
    this.elements.addButton.style.display = 'block'
    this.elements.back.style.opacity = '0'
    this.modalGallery.gallery.style.display = 'grid'
    this.elements.title.innerHTML = 'Galerie photo'
    this.newWork.elements.form.style.display = 'none'
    this.newWork.removeListener()
    this.elements.modal.close()
  }

  addListener = () => {
    this.elements.open.addEventListener('click', () => {
      this.elements.modal.showModal()
      this.modalGallery.createGallery(
        this.elements.modal,
        this.elements.addButton
      )

      this.modalGallery.addListeners()

      this.elements.addButton.style.display = 'block'

      this.elements.addButton.addEventListener('click', this.handleAddButton)

      this.elements.back.addEventListener('click', this.handleBackButton)

      this.elements.close.addEventListener('click', this.handleCloseButton)
    })
  }
}
