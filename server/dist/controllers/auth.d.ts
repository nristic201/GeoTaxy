import * as express from 'express';
declare class AuthController {
    taxiRepository: any;
    constructor();
    loginRequest: (req: express.Request, res: express.Response) => void;
}
declare const _default: AuthController;
export default _default;
