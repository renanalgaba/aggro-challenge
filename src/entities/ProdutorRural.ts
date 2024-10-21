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

  @Column({ type: 'varchar', length: 14 })
  @IsString()
  @Matches(/^\d+$/, { message: 'O documento deve conter apenas números.' })
  @Length(11, 14, {
    message: 'O documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos.',
  })
  documento: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255 })
  nomeFazenda: string;

  @Column({ type: 'varchar', length: 255 })
  cidade: string;

  @Column({ type: 'varchar', length: 2 })
  estado: string;

  @Column({ type: 'float' })
  areaTotal: number;

  @Column({ type: 'float' })
  areaAgricultavel: number;

  @Column({ type: 'float' })
  areaVegetacao: number;

  @Column({ type: 'simple-array' })
  culturas: string[];

  @BeforeInsert()
  @BeforeUpdate()
  sanitizeDocumento() {
    this.documento = this.documento.replace(/\D/g, '');
  }
}
