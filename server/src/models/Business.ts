import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { User } from './User';

export interface BusinessCreationAttributes {
  business_name: string;
  address?: string;
  phone_number?: string;
  user_id?: number;
}

@Table({ tableName: 'businesses', timestamps: false })
export class Business extends Model<Business, BusinessCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  user_id?: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @BelongsTo(() => User)
  owner?: User;
}
