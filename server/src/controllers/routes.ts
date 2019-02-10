
import { Router, Request, Response } from 'express';
import authController from './auth';
import DBService from '../services/db';
import taxiDriverController from './taxiDriver';

const db_conn = new DBService();
const router: Router = Router();
db_conn.getConnection().then(() => {
    router.post('/login', (req: Request, res: Response) => {
        authController.loginRequest(req, res);
    })
    router.get('/profile',(req: Request, res: Response)=>{
        taxiDriverController.getProfileData(req,res);
    })
})
export const apiRoute: Router = router;

