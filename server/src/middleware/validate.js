import { errorResponse } from '../utils/apiResponse.js';

export function validate(schema) {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return errorResponse(res, 'Validation failed. Please check your input.', 422, formattedErrors, 'VALIDATION_ERROR');
      }
      return errorResponse(res, err.message, 400, null, 'BAD_REQUEST');
    }
  };
}
