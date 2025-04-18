import { PrismaClient } from '@prisma/client'

// Function that returns a new PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Declare a global object to hold the Prisma instance in development
declare global {
  var prismaGlobal: PrismaClient | undefined
}

// Create a singleton for Prisma Client
const prisma = global.prismaGlobal ?? prismaClientSingleton()

// In development, assign the Prisma instance to globalThis to avoid creating multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma
}

export default prisma
