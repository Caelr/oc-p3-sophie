export default class Authentication {
  element: HTMLFormElement
  elements: { email: HTMLInputElement, password: HTMLInputElement, button: HTMLButtonElement, error: HTMLParagraphElement}
  api: string
  endpoint: string

  constructor({
    api,
    endpoint
  }: { api: string, endpoint: string }) {
    this.api = api
    this.endpoint = endpoint
    this.element = document.querySelector('.login__form') as HTMLFormElement

    this.elements = {
      email: document.querySelector('#email') as HTMLInputElement,
      password: document.querySelector('#password') as HTMLInputElement,
      button: document.querySelector('.login__form__button') as HTMLButtonElement,
      error: document.querySelector('.error') as HTMLParagraphElement
    }
    this.addListener()
  }

  authenticateUser = async (api: string, endpoint: string, data: { email: string, password: string }) => {
    try {
      const response = await fetch(`${api}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.status === 200) {
        const isAuth: { userId: number, token: string } = await response.json()
        console.log(isAuth)
        window.location.href = '/'
        // const tokenValidity = Date.now() + 24 * 60 * 60 * 1000
        // console.log(tokenValidity)
        // localStorage.setItem('Token', isAuth.token)
        // localStorage.setItem('TokenExpiryDate', `${tokenValidity}`)
      } else {

      }
    } catch (error) {
      console.log('Something wrong happened:' + error)
    }
  }

  addListener = () => {
    this.element.addEventListener('submit', (event) => {
      event.preventDefault()

      const data = {email: this.elements.email.value, password: this.elements.password.value}
      this.authenticateUser(this.api, this.endpoint, data)
    })
  }
}
