import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import env from './env.js'

const url = new URL(env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: url.hostname === 'localhost' ? '127.0.0.1' : url.hostname,
  port: url.port ? parseInt(url.port) : 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.substring(1),
  connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

export default prisma;
