import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity('formateurs')
export class Formateur {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // Un formateur = un user
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User
}
