export default class NewWork {
  constructor(api, endpoint, works) {
    this.validImage = false
    this.validCategory = false
    this.validTitle = false
    this.api = api
    this.endpoint = endpoint
    this.works = works
  }

  /**
   * Creates the NewWork form elements.
   */
  create() {
    this.elements = {
      form: document.querySelector('.modal__form'),
      inputUpload: document.getElementById('image'),
      inputTitle: document.getElementById('title'),
      size: document.querySelector('.size'),
      inputCategory: document.getElementById('category'),
      submitButton: document.querySelector('.form__submit'),
      previewImage: document.querySelector('.form__upload'),
    }
    const savedToken = localStorage.getItem('authToken')
    if (!savedToken) return
    this.token = JSON.parse(savedToken)
  }

  /**
   * Checks the validity of the uploaded image.
   */
  checkImageValidity(input) {
    const extensions = ['jpg', 'png']
    const maxFileSize = 4 * 1024 * 1024

    if (!input.files || input.files.length === 0) return false

    const file = input.files[0]
    const extension = file.name.split('.').pop()
    if (!extensions.includes(extension) || maxFileSize < file.size) {
      this.elements.size.innerHTML =
        'Extension non supporté ou image trop lourde (jpg, png : 4mo max)'
      this.elements.previewImage.style.border = '1px solid red'
      return false
    }

    this.elements.previewImage.style.border = 'none'

    this.children = Array.from(this.elements.previewImage.children)
    this.children.forEach((child) => {
      child.style.display = 'none'
    })

    const figure = document.createElement('figure')
    const image = document.createElement('img')
    image.src = URL.createObjectURL(file)
    image.alt = file.name
    image.classList.add('preview__image')
    figure.classList.add('preview__media')
    figure.append(image)
    this.elements.previewImage.append(figure)
    return true
  }

  /**
   * Checks the overall form validity.
   */
  checkFormValidity() {
    if (!this.validImage) {
      this.validImage = this.checkImageValidity(this.elements.inputUpload)
    }

    this.validTitle = this.elements.inputTitle.value.trim() !== ''

    if (
      this.elements.inputCategory.value === '1' ||
      this.elements.inputCategory.value === '2' ||
      this.elements.inputCategory.value === '3'
    ) {
      this.validCategory = true
    }

    const isValidForm = this.validCategory && this.validImage && this.validTitle

    if (isValidForm) {
      this.elements.submitButton.disabled = false
      this.elements.submitButton.style.backgroundColor = '#1D6154'
      this.elements.submitButton.style.cursor = 'pointer'
    } else {
      this.elements.submitButton.disabled = true
      this.elements.submitButton.style.backgroundColor = '#a7a7a7'
      this.elements.submitButton.style.cursor = 'not-allowed'
    }
  }

  /**
   * Handles the form submission for a new work.
   */
  async handleWorkSubmit(event) {
    event.preventDefault()

    const formData = new FormData(this.elements.form)

    try {
      const response = await fetch(`${this.api}${this.endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        console.log(response.status)
      }

      const data = await window.home.getApiData()
      const newWorkData = data.pop()
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      const figcaption = document.createElement('figcaption')

      if (!newWorkData) return
      figure.dataset.id = `${newWorkData.id}`
      image.src = newWorkData.imageUrl
      image.alt = newWorkData.title
      image.onload = () => image.classList.add('loaded')
      figcaption.innerHTML = `${newWorkData.title}`

      figure.append(image, figcaption)

      window.home.elements.gallery.append(figure)

      localStorage.removeItem('works')

      localStorage.setItem('works', JSON.stringify(data))
      this.validImage = false
      this.validTitle = false
      this.validCategory = false
      const previewImage = document.querySelector('.preview__media')

      // This code reset the upload input after a successful upload
      if (!previewImage) return
      previewImage.remove()
      this.children.forEach((child) => {
        if (this.children.indexOf(child) === 0) {
          child.style.display = 'block'
        } else {
          child.style.display = 'flex'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Adds event listeners for form input changes.
   */
  addListener() {
    this.elements.inputUpload.addEventListener('change', () =>
      this.checkFormValidity()
    )
    this.elements.inputCategory.addEventListener('change', () =>
      this.checkFormValidity()
    )
    this.elements.inputTitle.addEventListener('change', () => {
      this.checkFormValidity()
      if (!this.validTitle) {
        this.elements.inputTitle.style.border = 'solid 1px red'
        return
      }
      this.elements.inputTitle.style.border = 'none'
    })
  }

  /**
   * Removes event listeners.
   */
  removeListener() {
    this.elements.inputUpload.onchange = null
    this.elements.inputCategory.onchange = null
    this.elements.inputTitle.onchange = null
  }
}
