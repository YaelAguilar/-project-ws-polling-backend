import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../services/authService';
import { authentication } from '../utils/cryptoUtils';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Campo faltante' });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Este correo ya ha sido registrado' });
        }

        const user = await createUser(email, username, password);

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({ user, token, message: 'Registrado correctamente' });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Campo faltante' });
        }

        const user = await getUserByEmail(email);
        if (!user || user.authentication.password !== authentication(user.authentication.salt, password)) {
            return res.status(403).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ user, token, message: 'Sesión iniciada correctamente' });
    } catch (error) {
        console.error('Login Error:', error);
        return res.sendStatus(500);
    }
};
