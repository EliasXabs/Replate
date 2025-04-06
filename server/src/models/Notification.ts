// src/models/Notification.ts
import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from './User';
  
  @Table({ tableName: 'notification', timestamps: false })
  export class Notification extends Model<Notification> {
    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    user_id!: number;
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    message!: string;
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    read!: boolean;
  
    @Column({
      type: DataType.DATE,
      allowNull: false,
      defaultValue: DataType.NOW,
      field: 'timestamp',
    })
    timestamp!: Date;
  
    @BelongsTo(() => User)
    user!: User;
  }
  