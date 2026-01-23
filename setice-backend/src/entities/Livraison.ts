import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { Assignation } from '@/src/entities/Assignation'

@Entity('livraisons')
export class Livraison {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @OneToOne(() => Assignation, { eager: true })
  @JoinColumn()
  assignation!: Assignation

  @Column({ nullable: true })
  fichierUrl?: string

  @Column({ type: 'text', nullable: true })
  texte?: string

  @CreateDateColumn()
  dateLivraison!: Date
}