import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';

interface UserAttributes {
    user_id: number;
    email: string;
    password?: string;
    nickname: string;
    sns_id?: string;
    provider: string;
    created_at?: Date;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, 'user_id' | 'sns_id' | 'created_at'> {}
//회원가입 시 입력받지 않아도 되는 필드

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public user_id!: number;
    public email!: string;
    public password?: string;
    public nickname!: string;
    public sns_id?: string;
    public provider!: string;
    public created_at?: Date;
}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        sns_id: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'local',
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'User',
        timestamps: false,
    }
);

export default User;
