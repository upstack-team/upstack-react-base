import { Etudiant } from '@/src/entities/Etudiant'
import { getDataSource } from '@/src/lib/db'

export const etudiantRepository = {
  async findByUserId(userId: string) {
    const db = await getDataSource()
    return db.getRepository(Etudiant).findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    })
  },

  async findById(id: string) {
    const db = await getDataSource()
    return db.getRepository(Etudiant).findOne({
      where: { id },
      relations: ['user'],
    })
  },
}
