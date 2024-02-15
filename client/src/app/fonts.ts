import { Inter } from 'next/font/google'
import '@/styles/globals.scss'

const inter = Inter({ subsets: ['latin'], variable: '--inter', weight: ['400', '500', '600', '700'] })

export const FontsVariables = `${inter.variable}`