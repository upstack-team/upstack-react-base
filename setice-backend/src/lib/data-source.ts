import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '@/src/entities/User'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Etudiant } from '@/src/entities/Etudiant'
import { Matiere } from '../entities/Matiere'
import { EspacePedagogique } from '../entities/EspacePedagogique'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // 👈 clé
  synchronize: true,
  logging: true,
  entities: [User, Promotion, Formateur, Etudiant, Matiere, EspacePedagogique],
})
