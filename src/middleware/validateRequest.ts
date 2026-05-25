import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from '../logger'
import * as response from "../responses/index";

const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('validating request:', req.body)
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        })
        return next()
    } catch (error: any) {
        log.error(error)
        response.badRequest(res, { message: error.errors })
    }
}

export default validate;