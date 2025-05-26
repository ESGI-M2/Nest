export class UserNotFoundError extends Error {
  private readonly _id?: string;

  constructor(id?: string) {
    super(`User not found`);
    this.name = 'UserNotFoundError';
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }
}
