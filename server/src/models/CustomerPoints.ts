// src/models/CustomerPoints.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
  } from 'sequelize-typescript';
  import { User } from './User';
  
  @Table({ tableName: 'customer_points', timestamps: false })
  export class CustomerPoints extends Model<CustomerPoints> {
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      unique: true,
    })
    user_id!: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    points!: number;
  
    // Using CreatedAt decorator for the 'last_updated' field (as per schema)
    @CreatedAt
    @Column({ field: 'last_updated' })
    lastUpdated!: Date;
  
    @BelongsTo(() => User)
    user!: User;
  }
  