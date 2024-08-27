import { PrismaClient } from "@prisma/client";
import { PrismaClientExtends } from "@prisma/client/extension";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'event',
      level: 'info'
    },
    {
      emit: 'event',
      level: 'error'
    },
    {
      emit: 'event',
      level: 'warn'
    },
  ]
});

prismaClient.$on('error', (e) => {
  logger.error(e);
});