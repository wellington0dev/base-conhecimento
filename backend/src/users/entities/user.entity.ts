import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.INTERN })
  role: UserRole;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relação preparada para quando a entidade Article for criada.
  // Basta importar Article e descomentar as duas linhas abaixo:
  //
  // @OneToMany(() => Article, (article) => article.author)
  // articles: Article[];
}
