import { Data } from '../@types'

export default class NewWork {
  elements: {
    form: HTMLFormElement
    inputUpload: HTMLInputElement
    inputTitle: HTMLInputElement
    inputCategory: HTMLInputElement
    submitButton: HTMLButtonElement
    previewImage: HTMLElement
  }
  token: string

  children: HTMLElement[]

  validImage: boolean = false
  validTitle: boolean = false
  validCategory: boolean = false

  constructor(
    public api: string,
    public endpoint: string,
    public works: Data[]
  ) {
    this.api = api
    this.endpoint = endpoint
    this.works = works
  }

  create() {
    this.elements = {
      form: document.querySelector('.modal__form') as HTMLFormElement,
      inputUpload: document.getElementById('image') as HTMLInputElement,
      inputTitle: document.getElementById('title') as HTMLInputElement,
      inputCategory: document.getElementById('category') as HTMLInputElement,
      submitButton: document.querySelector(
        '.form__submit'
      ) as HTMLButtonElement,
      previewImage: document.querySelector('.form__upload') as HTMLElement,
    }
    const savedToken = localStorage.getItem('authToken')
    if (!savedToken) return
    this.token = JSON.parse(savedToken)
  }

  checkImageValidity = (input: HTMLInputElement) => {
    const extensions = ['jpg', 'png']
    const maxFileSize = 4 * 1024 * 1024

    if (!input.files || input.files.length === 0) return false

    const file = input.files[0]
    const extension = file.name.split('.').pop() as string
    if (!extensions.includes(extension) || maxFileSize < file.size) {
      this.elements.previewImage.style.border = '1px solid red'
      return false
    }

    this.elements.previewImage.style.border = 'none'

    this.children = Array.from(
      this.elements.previewImage.children
    ) as HTMLElement[]
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

  checkFormValidity = () => {
    if (!this.validImage) {
      this.validImage = this.checkImageValidity(this.elements.inputUpload)
    }
    this.validTitle = this.elements.inputTitle.value.trim() !== ''
    this.validCategory = this.elements.inputCategory.value !== ''

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


  handleWorkSubmit = async (event: SubmitEvent) => {
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

      const data: Data[] = await window.home.getApiData()
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

      if (!previewImage) return
      previewImage.remove()
      this.children.forEach(child => {
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

  addListener = () => {
    this.elements.inputUpload.onchange = this.checkFormValidity
    this.elements.inputCategory.onchange = this.checkFormValidity
    this.elements.inputTitle.onchange = this.checkFormValidity
  }

  removeListener = () => {
    this.elements.inputUpload.onchange = null
    this.elements.inputCategory.onchange = null
    this.elements.inputTitle.onchange = null
  }
}
