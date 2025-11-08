export default class CustomError extends Error {
  constructor(cause: string) {
    super(cause);
  }
}
