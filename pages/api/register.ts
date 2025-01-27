import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { registerUser } from '../../services/authService';

const SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

// Tipe data untuk user
interface User {
  _id: string;
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    try {
      const { username, password }: { username: string; password: string } =
        req.body;

      // Validasi input
      if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
      }

      const user: User | null = await registerUser(username, password);

      if (!user) {
        res.status(400).json({ message: 'Registration failed' });
        return;
      }

      // Buat JWT untuk user yang baru terdaftar
      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }, // Token berlaku selama 1 jam
      );

      // Set cookie dengan token
      res.setHeader(
        'Set-Cookie',
        `user=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`,
      );

      // Respons dengan data user (tanpa password)
      res.status(201).json({
        message: 'User successfully registered',
        user: { username: user.username, userId: user._id },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
