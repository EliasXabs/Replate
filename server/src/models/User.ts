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
  
  // Define an interface for the attributes required when creating a new user.
  export interface IUserCreationAttributes {
    name: string;
    email: string;
    password_hash: string;
    role: string;
  }
  
  @Table({ tableName: 'users', timestamps: false })
  export class User extends Model<User, IUserCreationAttributes> {
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
  
    @HasOne(() => Admin)
    admin?: Admin;
  
    @HasMany(() => Business)
    businesses?: Business[];
  }
  