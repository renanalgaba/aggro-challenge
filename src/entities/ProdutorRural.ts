import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Length, IsString, Matches } from 'class-validator';

@Entity()
export class ProdutorRural {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 14 })
  @IsString()
  @Matches(/^\d+$/, { message: 'O documento deve conter apenas números.' })
  @Length(11, 14, {
    message: 'O documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos.',
  })
  documento: string;

  @Column()
  nome: string;

  @Column()
  nomeFazenda: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column('float')
  areaTotal: number;

  @Column('float')
  areaAgricultavel: number;

  @Column('float')
  areaVegetacao: number;

  @Column('simple-array')
  culturas: string[];

  @BeforeInsert()
  @BeforeUpdate()
  sanitizeDocumento() {
    this.documento = this.documento.replace(/\D/g, '');
  }
}
