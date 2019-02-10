import * as express from 'express';
import { TaxiDriverRepository } from '../customRepositories/taxyDriver.repository';
import { getCustomRepository } from 'typeorm';

class AuthController {
    public taxiRepository: any;
    constructor() {
    }
    loginRequest = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;
        this.taxiRepository = getCustomRepository(TaxiDriverRepository);
        this.taxiRepository.findDriverByUsername(username)
            .then((user: any) => {
                if (user.password === password) {
                    res.json(user);
                }
                res.json({
                    error: "wrong data"
                });

            });
    }
}
export default new AuthController();