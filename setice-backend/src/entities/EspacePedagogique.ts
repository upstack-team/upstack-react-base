import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Promotion } from './Promotion'
import { Formateur } from './Formateur'
import { Matiere } from './Matiere'
import { Etudiant } from './Etudiant'

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

  @ManyToMany(() => Etudiant, { eager: false })
  @JoinTable({
    name: 'etudiants_espaces_pedagogiques',
    joinColumn: { name: 'espacePedagogiqueId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'etudiantId', referencedColumnName: 'id' }
  })
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}