import {type Response, type Request, type NextFunction} from "express";
import {ZodError} from "zod";
import {ResponseError} from "../error/response-error";
import { logger } from "../application/logging";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            status: 'error',
            data: {
                errors: error.format()
            }
        }).end();
    } else if(error instanceof ResponseError){
        res.status(error.status).json({
            status: 'error',
            data: {
                errors: error.message
            }
        }).end();
    } else {
        logger.debug(error.message);
        res.status(500).json({
            status: 'error',
            data: {
                errors: 'Internal Server Error'
            }
        }).end();
    }
} 