import { NextApiRequest, NextApiResponse } from 'next';
import { deleteHistory } from '../../../services/historyService';
import { validateUser } from '../../../utils/validateUser';
interface User {
  id: string;
  username: string;
  iat: number;
  exp: number;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      const user: User = validateUser(req);
      const { historyId } = req.query;
      if (typeof historyId !== 'string') {
        throw new Error('Invalid historyId');
      }
      const result = await deleteHistory(user.username, historyId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: 'Unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
