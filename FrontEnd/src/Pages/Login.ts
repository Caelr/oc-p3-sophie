export default class Login {
  private elements: {
    form: HTMLFormElement
    email: HTMLInputElement
    password: HTMLInputElement
    submit: HTMLButtonElement
  }

  private api: string
  private endpoint: string

  constructor({ api, endpoint }: { api: string; endpoint: string }) {
    this.api = api
    this.endpoint = endpoint
  }

  create = () => {
    this.elements = {
      form: document.querySelector('.login__form') as HTMLFormElement,
      email: document.getElementById('email') as HTMLInputElement,
      password: document.getElementById('password') as HTMLInputElement,
      submit: document.querySelector(
        '.login__form__button'
      ) as HTMLButtonElement,
    }
  }

  wrongCredentials = (status: number) => {
    if (status === 401) {
      const p = document.createElement('p')
      p.innerHTML = 'Erreur dans l’identifiant ou le mot de passe'
      p.style.color = '#ff9494'
      this.elements.form.insertBefore(p, this.elements.submit)
    }
  }

  setToken = (token: string) => {
    const currentTime = new Date().getTime()
    const expiration = currentTime + 24 * 60 * 60 * 1000
    localStorage.setItem('authToken', JSON.stringify({
      token,
      expiration
    }))
  }

  signIn = async () => {
    try {
      const response = await fetch(`${this.api}${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email: this.elements.email.value,
          password: this.elements.password.value,
        }),
      })

      if (!response.ok) {
        switch (response.status) {
          case 401:
            this.wrongCredentials(401)
            break
          case 404:
            console.log(404)
            break
        }
      }

      const data: { userId: number; token: string } = await response.json()
      this.setToken(data.token)
      location.href = '/'
    } catch (error) {
      console.log(`Error from fetch: ${error}`)
    }
  }

  addListener = () => {
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = {
        email: this.elements.email.value,
        password: this.elements.password.value,
      }
      this.signIn()
    })
  }
}
