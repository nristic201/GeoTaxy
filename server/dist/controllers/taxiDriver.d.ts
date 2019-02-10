import * as express from 'express';
declare class TaxiDriverController {
    taxiRepository: any;
    constructor();
    getProfileData(req: express.Request, res: express.Response): void;
}
declare const _default: TaxiDriverController;
export default _default;
