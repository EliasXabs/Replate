// src/models/User.ts
import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    HasOne,
    HasMany,
  } from 'sequelize-typescript';
  import { Admin } from './Admin';
  import { Business } from './Business';
  
  @Table({ tableName: 'users', timestamps: false })
  export class User extends Model<User> {
    @Column({
      type: DataType.STRING(100),
      allowNull: false,
    })
    name!: string;
  
    @Column({
      type: DataType.STRING(100),
      allowNull: false,
      unique: true,
    })
    email!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    password_hash!: string;
  
    @Column({
      type: DataType.STRING(20),
      allowNull: false,
    })
    role!: string;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;
  
    // A user may have one admin record if they are an admin
    @HasOne(() => Admin)
    admin?: Admin;
  
    // A user may own multiple businesses
    @HasMany(() => Business)
    businesses?: Business[];
  }
  