import { IMessage } from "@/models/IMessage";

export const numberUnreadMessages = (messages: IMessage[], username: string): number => {
  const result: IMessage[] = []
  for (let i = messages.length - 1; i > -1; i--) {
    const item = messages[i];
    if (!item.isRead && item.from !== username) {
      result.push(item)
    } else {
      return result.length;
    }
  }
  return result.length
}
