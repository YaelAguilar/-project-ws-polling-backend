import { UserModel } from '../models/user';
import { random, authentication } from '../utils/cryptoUtils';

export const createUser = async (email: string, username: string, password: string) => {
    const salt = random();
    const hashedPassword = authentication(salt, password);
    const user = new UserModel({
        email,
        username,
        authentication: { salt, password: hashedPassword }
    });
    await user.save();
    return user.toObject();
};

export const getUserByEmail = (email: string) => {
    return UserModel.findOne({ email }).select('+authentication.salt +authentication.password');
};
