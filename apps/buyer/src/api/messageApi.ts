import { API_BASE_URL } from "../config/api";

export const fetchMessages = async () => {
  const response = await fetch(`${API_BASE_URL}/messages`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

export const fetchConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/conversations`);
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
};

export const sendMessage = async (content: string, receiverId: number) => {
  const response = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, receiver_id: receiverId }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};
