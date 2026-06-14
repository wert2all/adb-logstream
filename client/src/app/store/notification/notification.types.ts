export type Message = {
  uuid: string;
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
};
export type NotificationState = {
  messages: Message[];
};
