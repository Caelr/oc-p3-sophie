import { Data } from "../@types"

export default class Filter {
  inputValue: string

  constructor() {
    // setup
    this.inputValue = 'Tous'
  }

  protected getDataFromApi = async (api: string, endpoint: string) => {
    const response = await fetch(`${api}${endpoint}`)
    const data: Data[] = await response.json()
    if (this.inputValue === 'Tous') return data
    const filteredData = data.filter(work => work.category.name === this.inputValue)
    return filteredData
  }
}
