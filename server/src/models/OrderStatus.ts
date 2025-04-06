// src/models/OrderStatus.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'order_status', timestamps: false })
export class OrderStatus extends Model<OrderStatus> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  status_name!: string;
}
