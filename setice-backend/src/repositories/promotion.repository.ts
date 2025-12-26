import { Promotion } from '@/src/entities/Promotion'
import { getDataSource } from '@/src/lib/db'

export const promotionRepository = {
  async findByCode(code: string) {
    const db = await getDataSource()
    return db.getRepository(Promotion).findOne({
      where: { code },
    })
  },

  async create(data: {
    code: string
    libelle: string
    annee: string
  }) {
    const db = await getDataSource()
    return db.getRepository(Promotion).save(data)
  },
}
