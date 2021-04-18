import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./User";

@Table
export class Post extends Model {
  // INTEGER指定しないとsqliteはこのカラムを文字列にしてくる
  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  userId?: string;

  @Column
  title?: string;

  // mysqlの時、指定してもsequelize.sync()でTEXTがなぜか入らない
  @Column(DataType.TEXT)
  body?: string;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;

  @BelongsTo(() => User)
  user!: User;
}
