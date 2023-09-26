export default class Login {
  constructor({ api, endpoint }) {
    this.api = api
    this.endpoint = endpoint
  }

  /**
   * Creates the login form elements.
   */
  create = () => {
    this.elements = {
      form: document.querySelector('.login__form'),
      email: document.getElementById('email'),
      password: document.getElementById('password'),
      submit: document.querySelector('.login__form__button'),
    }
  }

  /**
   * Handles wrong credentials status.
   */
  wrongCredentials = (status) => {
    if (status === 401) {
      const p = document.createElement('p')
      p.innerHTML = 'Erreur dans l’identifiant ou le mot de passe'
      p.style.color = '#ff9494'
      this.elements.form.insertBefore(p, this.elements.submit)
    }
  }

  /**
   * Handles the sign-in process.
   */
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
        return
      }

      const data = await response.json()
      localStorage.setItem('authToken', JSON.stringify(data.token))
      location.href = '/'
    } catch (error) {
      console.log(`Error from fetch: ${error}`)
    }
  }

  /**
   * Adds event listener for the login form submission.
   */
  addListener() {
    this.elements.form.addEventListener('submit', (event) => {
      event.preventDefault()
      this.signIn()
    })
  }
}
