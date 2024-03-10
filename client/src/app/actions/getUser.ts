'use server'

import { IUser } from "@/models/IUser"
import { cookies } from "next/headers"

export async function getUser(): Promise<IUser> {
  const token = cookies().has('token') ? `Bearer ${cookies().get('token')?.value}` : ''
  const options = {
    headers: {
      authorization: token
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}api/user`, options)
  const data = await response.json()
  return data
}