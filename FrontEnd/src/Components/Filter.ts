export default class Filter{
  form: HTMLFormElement
  constructor() {
    this.form = document.querySelector('.filter') as HTMLFormElement
    this.filterByCategory()
  }

  filterByCategory = () => {
    this.form.addEventListener('click', (e) => {
      console.log(e.target)
    })
  }
}
