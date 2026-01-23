// src/entities/Assignation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm'
import { Travail } from './Travail'
import { Etudiant } from './Etudiant'
import { User } from './User'

export enum StatutAssignation {
  ASSIGNE = 'ASSIGNE',
  LIVRE = 'LIVRE',
  EVALUE = 'EVALUE',
}

@Entity('assignations')
@Unique(['travail', 'etudiant'])
export class Assignation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Travail, { eager: true })
  travail!: Travail

  @ManyToOne(() => Etudiant, { eager: true })
  etudiant!: Etudiant

  @ManyToOne(() => User, { eager: true })
  formateur!: User // celui qui assigne

  @Column({
    type: 'enum',
    enum: StatutAssignation,
    default: StatutAssignation.ASSIGNE,
  })
  statut!: StatutAssignation

  @Column({ type: 'timestamp', nullable: true })
  dateLivraison?: Date // pour US 8.1

  @CreateDateColumn()
  createdAt!: Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dateAssignation: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evaluation: any
}
