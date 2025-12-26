import { AppDataSource } from '@/src/lib/data-source'
import { Formateur } from '@/src/entities/Formateur'
import { User } from '@/src/entities/User'

export const formateurRepository = {
  async create(user: User) {
    const repo = AppDataSource.getRepository(Formateur)

    const formateur = repo.create({
      user,
    })

    return repo.save(formateur)
  },
}
