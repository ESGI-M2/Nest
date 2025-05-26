export class EmailAlreadyTakenError extends Error {
  private _email: string | undefined;

  constructor(email?: string) {
    super('Email already exists');
    this._email = email;
    this.name = 'EmailAlreadyExistsError';
  }

  get email() {
    return this._email;
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsError';
  }
}
