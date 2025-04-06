// src/models/MenuItem.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
  } from 'sequelize-typescript';
  import { Business } from './Business';
  
  @Table({ tableName: 'menu_items', timestamps: false })
  export class MenuItem extends Model<MenuItem> {
    @ForeignKey(() => Business)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    business_id!: number;
  
    @Column({
      type: DataType.STRING(100),
      allowNull: false,
    })
    name!: string;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    description?: string;
  
    @Column({
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
    })
    price!: number;
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    image_url?: string;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
    available!: boolean;
  
    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt!: Date;
  
    @BelongsTo(() => Business)
    business!: Business;
  }
  