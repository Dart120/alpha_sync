export class APNotFoundException extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'APNotFoundException'
  }
}
