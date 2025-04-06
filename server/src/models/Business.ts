// src/models/Business.ts
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';

@Table({ tableName: 'businesses', timestamps: false })
export class Business extends Model<Business> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  business_name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone_number?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}
