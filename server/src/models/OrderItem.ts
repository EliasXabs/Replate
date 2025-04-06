// src/models/OrderItem.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { Order } from './Order';
  import { MenuItem } from './MenuItem';
  
  @Table({ tableName: 'order_items', timestamps: false })
  export class OrderItem extends Model<OrderItem> {
    @ForeignKey(() => Order)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    order_id!: number;
  
    @ForeignKey(() => MenuItem)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    menu_item_id!: number;
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    quantity!: number;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    price!: number;
  
    @BelongsTo(() => Order)
    order!: Order;
  
    @BelongsTo(() => MenuItem)
    menuItem!: MenuItem;
  }
  