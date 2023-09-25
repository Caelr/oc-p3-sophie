import NewWork from '../Classes/NewWork.js'
import ModalGallery from './ModalGallery.js'

export default class Modal {
  constructor(api, endpoint, works) {
    this.api = api
    this.endpoint = endpoint
    this.works = works
    this.newWork = new NewWork(this.api, this.endpoint, this.works)
    this.modalGallery = new ModalGallery()
  }

  /**
   * Creates the Modal elements.
   */
  create = () => {
    this.elements = {
      modal: document.querySelector('.modal'),
      title: document.querySelector('.modal__title'),
      addButton: document.querySelector('.modal__button'),
      portfolioTitle: document.querySelector('.portfolio__title'),
      open: document.querySelector('.portfolio__edit'),
      close: document.querySelector('.close__modal'),
      back: document.querySelector('.back__modal'),
    }
    this.newWork.create()
    this.modalGallery.create()
    this.elements.portfolioTitle.style.marginBlockEnd = '92px'
  }

  /**
   * Shows the gallery.
   */
  showGallery = () => {
    this.elements.addButton.style.display = 'block'
    this.elements.back.style.opacity = '0'
    this.modalGallery.gallery.style.display = 'grid'
    this.elements.title.innerHTML = 'Galerie photo'
    this.newWork.elements.form.style.display = 'none'
  }

  /**
   * Shows the form.
   */
  showForm = () => {
    this.elements.addButton.style.display = 'none'
    this.elements.back.style.opacity = '1'
    this.modalGallery.gallery.style.display = 'none'
    this.elements.title.innerHTML = 'Ajout photo'
    this.newWork.elements.form.style.display = 'grid'
  }

  /**
   * Handles the form submission.
   */
  handleSubmitForm = (event) => {
    this.newWork.handleWorkSubmit(event)
    this.newWork.elements.inputCategory.value = ''
    this.newWork.elements.inputTitle.value = ''
    this.newWork.elements.inputUpload.value = ''
    this.showGallery()
    this.newWork.removeListener()
    this.elements.modal.close()
  }

  /**
   * Handles the add button click.
   */
  handleAddButton = () => {
    this.showForm()
    this.newWork.addListener()
    this.newWork.elements.form.addEventListener('submit', this.handleSubmitForm)
  }

  /**
   * Handles the back button click.
   */
  handleBackButton = () => {
    this.showGallery()
    this.newWork.removeListener()
  }

  /**
   * Handles the close button click.
   */
  handleCloseButton = () => {
    this.elements.back.removeEventListener('click', this.handleBackButton)
    this.elements.addButton.removeEventListener('click', this.handleAddButton)
    this.showGallery()
    this.removeListener()
  }

  /**
   * Adds event listeners.
   */
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

  /**
   * Removes event listeners.
   */
  removeListener = () => {
    this.newWork.removeListener()
    this.modalGallery.removeListener()
    this.newWork.elements.form.removeEventListener(
      'submit',
      this.handleSubmitForm
    )
    this.elements.modal.close()
  }
}
