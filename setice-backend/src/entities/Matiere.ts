import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { EspacePedagogique } from './EspacePedagogique'

@Entity('matieres')
export class Matiere {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  code!: string

  @Column()
  libelle!: string

  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('./EspacePedagogique').EspacePedagogique,
    (espace: EspacePedagogique) => espace.matiere
  )
  espacesPedagogiques!: EspacePedagogique[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
