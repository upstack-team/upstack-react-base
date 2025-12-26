import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Promotion } from './Promotion'
import { Formateur } from './Formateur'
import { Matiere } from './Matiere'

@Entity('espaces_pedagogiques')
export class EspacePedagogique {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(
    () => Promotion,
    { nullable: false }
  )
  promotion!: Promotion

  @ManyToOne(
    () => Matiere,
    { nullable: false }
  )
  matiere!: Matiere

  @ManyToOne(
    () => Formateur,
    { nullable: false }
  )
  formateur!: Formateur

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
