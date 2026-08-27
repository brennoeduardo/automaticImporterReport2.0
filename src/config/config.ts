import * as dotenv from 'dotenv'
dotenv.config()

export const config = {
  urlProtheus: process.env.URLPROTHEUS as string,
  termoBusca: process.env.TERMOBUSCA as string,
  caminhoAcom075: process.env.CAMINHOACOM075 as string,
  pastaImportador: process.env.PASTAIMPORTADOR as string,
  headless: true,
} as const;