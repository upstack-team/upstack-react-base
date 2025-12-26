import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import type { Etudiant } from './Etudiant'

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // Code unique de la promotion
  @Column({ unique: true })
  code!: string

  // Libellé (ex: Licence 3 GL)
  @Column()
  libelle!: string

  // Année académique
  @Column()
  annee!: string

  // Étudiants de la promotion
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('./Etudiant').Etudiant,
    (etudiant: Etudiant) => etudiant.promotion
  )
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
