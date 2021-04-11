import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @Column
  firstName?: string;

  @Column
  lastName?: string;

  @Column
  email?: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
