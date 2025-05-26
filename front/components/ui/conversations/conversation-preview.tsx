'use client';

import React from 'react';
import { format } from 'date-fns';

export type Conversation = {
  id: string;
  name: string;
  createdAt: string;
};

interface ConversationPreviewProps {
  conversation: Conversation;
  onClick?: () => void;
}

export default function ConversationPreview({
  conversation,
  onClick,
}: ConversationPreviewProps) {
  return (
    <li
      key={conversation.id}
      className="flex flex-col p-2 bg-base-100 rounded cursor-pointer hover:bg-base-300 transition"
      onClick={onClick}
    >
      <div className="">
        <p className="font-medium">{conversation.name}</p>
        <p className="text-xs text-gray-500">
          {format(new Date(conversation.createdAt), 'PP p')}
        </p>
      </div>
    </li>
  );
}
