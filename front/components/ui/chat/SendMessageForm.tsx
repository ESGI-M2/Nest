"use client";

import { useReducer } from "react";
import { sendMessageAPI } from "@/app/actions/sendMessage";
import {
  MessageFormData,
  MessageFormErrors,
  MessageFormState,
  initialMessageFormState,
} from "@/lib/definitions";
import { FormErrorMessage } from "@/components/ui/form/FormErrorMessage";

type Action =
  | { type: "FIELD_CHANGE"; field: keyof MessageFormData; value: string }
  | { type: "SET_ERRORS"; errors: MessageFormErrors }
  | { type: "SET_MESSAGE"; message?: string }
  | { type: "SET_SUCCESS"; success: boolean }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "RESET" };

function reducer(state: MessageFormState, action: Action): MessageFormState {
  switch (action.type) {
    case "FIELD_CHANGE":
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: undefined },
        message: undefined,
        success: false,
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors, loading: false, success: false };
    case "SET_MESSAGE":
      return { ...state, message: action.message, loading: false, success: false };
    case "SET_SUCCESS":
      return { ...state, success: action.success, loading: false, errors: {}, message: undefined };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "RESET":
      return initialMessageFormState;
    default:
      return state;
  }
}

export default function SendMessageForm({ recipientId }: { recipientId?: string }) {
  const [state, dispatch] = useReducer(reducer, initialMessageFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", loading: true });

    console.log("Submitting message:", state.data);

    const response = await sendMessageAPI({
      ...state.data,
      recipientId : recipientId || '0',
    });

    console.log("Response from sendMessageAPI:", response);

    if (response.success) {
      dispatch({ type: "SET_SUCCESS", success: true });
      dispatch({ type: "RESET" });
    } else if (response.errors) {
      dispatch({ type: "SET_ERRORS", errors: response.errors });
    } else {
      dispatch({
        type: "SET_MESSAGE",
        message: response.message || "Erreur inconnue.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center p-2 gap-2 border-t"
    >
      <input
        type="text"
        name="content"
        placeholder="Votre message..."
        value={state.data.content}
        onChange={(e) =>
          dispatch({
            type: "FIELD_CHANGE",
            field: "content",
            value: e.target.value,
          })
        }
        className="input input-bordered flex-1 rounded-full"
      />
      <button
        type="submit"
        className={`btn btn-circle btn-primary ${
          state.loading ? "btn-disabled" : ""
        }`}
        disabled={state.loading}
      >
        ➤
      </button>
      {state.errors.content && (
        <FormErrorMessage>{state.errors.content}</FormErrorMessage>
      )}
      {state.success === false && state.message && (
        <small className="text-error">{state.message}</small>
      )}
    </form>
  );
}
