'use server'

import { IUser } from "@/models/IUser"

export async function getChatUsers(token: string): Promise<IUser[]> {
  const options = {
    headers: {
      authorization: token
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}api/chat-users`, options)
  const data = await response.json()
  return data
}