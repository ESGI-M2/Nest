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

export class UserNotPartOfConversationError extends Error {
  private readonly _conversationId?: string;
  private readonly _userId?: string;

  constructor(conversationId: string, userId: string) {
    super(`User ${userId} is not part of conversation ${conversationId}`);
    this.name = 'UserNotPartOfConversationError';
    this._conversationId = conversationId;
    this._userId = userId;
  }

  get conversationId(): string | undefined {
    return this._conversationId;
  }

  get userId(): string | undefined {
    return this._userId;
  }
}
