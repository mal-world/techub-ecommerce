import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const userModel = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        len: [3, 100]
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(value, salt);
        this.setDataValue('password_hash', hashed);
      }
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    hooks: {
      beforeUpdate: (user) => {
        if (user.changed('password_hash')) {
          const salt = bcrypt.genSaltSync(10);
          user.password_hash = bcrypt.hashSync(user.password_hash, salt);
        }
      }
    }
  });

  userModel.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password_hash);
  };

  return userModel;
};
