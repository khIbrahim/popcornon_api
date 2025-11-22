import {z} from "zod";

export function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.length > 0 ? issue.path.join('.') : 'root',
            message: issue.message,
          })),
        });
      }
      next(error);
    }
  };
}