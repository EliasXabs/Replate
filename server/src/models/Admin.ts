// src/models/Admin.ts
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
  
  @Table({ tableName: 'admin', timestamps: false })
  export class Admin extends Model<Admin> {
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      unique: true,
    })
    user_id!: number;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;
  
    @BelongsTo(() => User)
    user!: User;
  }
  