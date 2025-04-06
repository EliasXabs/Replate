// src/models/Order.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    CreatedAt,
  } from 'sequelize-typescript';
  import { User } from './User';
  import { Business } from './Business';
  import { OrderStatus } from './OrderStatus';
  import { OrderItem } from './OrderItem';
  
  @Table({ tableName: 'orders', timestamps: false })
  export class Order extends Model<Order> {
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    user_id!: number;
  
    @ForeignKey(() => Business)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    business_id!: number;
  
    @ForeignKey(() => OrderStatus)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    status_id!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: true,
    })
    total_price?: number;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;
  
    @BelongsTo(() => User)
    user!: User;
  
    @BelongsTo(() => Business)
    business!: Business;
  
    @BelongsTo(() => OrderStatus)
    orderStatus!: OrderStatus;
  
    @HasMany(() => OrderItem)
    orderItems?: OrderItem[];
  }
  