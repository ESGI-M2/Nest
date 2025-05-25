export class ConversationNotFoundError extends Error {
  private readonly _id?: string;
  constructor(id?: string) {
    super(`Conversation not found`);
    this.name = 'ConversationNotFoundError';
    this._id = id;
  }

  get id(): string | undefined {
    return this._id;
  }
}
