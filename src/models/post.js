'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        // https://sequelize.org/master/manual/assocs.html#customizing-the-foreign-key
        // TODO 指定しなくて良いはずなのだけどなぜか動かなかった。そのうち調査する。
        foreignKey: 'userId'
      })
    }
  };
  Post.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
