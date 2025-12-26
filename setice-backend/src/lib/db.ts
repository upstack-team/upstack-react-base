import { AppDataSource } from './data-source'


let initialized = false

export async function getDataSource() {
  if (!initialized) {
    console.log('⏳ Initialisation DB...')
    await AppDataSource.initialize()
    console.log('✅ DB connectée')

    

    initialized = true
  }

  return AppDataSource
}
