import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import type { Promotion } from './Promotion'
import { User } from './User'

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // L'étudiant appartient à UNE promotion
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('./Promotion').Promotion,
    (promotion: Promotion) => promotion.etudiants,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    }
  )
  @JoinColumn()
  promotion!: Promotion

  // L'étudiant est un user
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User
}
