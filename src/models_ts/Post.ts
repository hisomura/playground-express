import {
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./User";

@Table
export class Post extends Model<Post> {
  @Column
  userId?: string;

  @Column
  title?: string;

  @Column
  body?: string;

  @CreatedAt
  @Column
  createdAt?: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;

  @BelongsTo(() => User)
  user!: User
}
