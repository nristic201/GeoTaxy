
import { Router, Request, Response } from 'express';
import authController from './auth.controller';
import DBService from '../services/db.service';

const db_conn = new DBService();
const router: Router = Router();
db_conn.getConnection().then(() => {
    router.post('/login', (req: Request, res: Response) => {
        authController.loginRequest(req, res);
    })
})
export const apiRoute: Router = router;

