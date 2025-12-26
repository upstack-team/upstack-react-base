import { AppDataSource } from '@/src/lib/data-source'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

export const espacePedagogiqueRepository = {
  create(data: {
    promotionId: string
    matiereId: string
    formateurId: string
  }) {
    return AppDataSource.getRepository(EspacePedagogique).save({
      promotion: { id: data.promotionId },
      matiere: { id: data.matiereId },
      formateur: { id: data.formateurId },
    })
  },
}
