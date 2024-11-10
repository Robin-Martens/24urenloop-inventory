import { Request, Response } from 'express'
import { err, ok, Result, ResultAsync } from 'neverthrow'
import { z } from 'zod'

import { mapRouteError, RouteError } from './errors.ts'
import { parseZodIssues } from './utils.js'

export function route<T>(
  handler: RouteHandler<T>,
  wrapWithData: boolean = true,
): Handler {
  return (req: Request, res: Response) => {
    wrapHandler(handler(req), res, wrapWithData)
  }
}

export function parse<T extends z.ZodTypeAny>(
  schema: T,
  raw: unknown,
  msg?: string,
): DecodeResult<z.infer<T>> {
  try {
    const parsed = schema.safeParse(raw)

    return parsed.success
      ? ok(parsed.data)
      : err(parseZodIssues(parsed.error.issues))
  } catch {
    return err(msg || 'Invalid data')
  }
}

export function pass<T>(data: T): DecodeResult<T> {
  return ok(data)
}

function wrapHandler<T>(
  handlerResult: ReturnType<RouteHandler<T>>,
  res: Response,
  wrapWithData: boolean = true,
): void {
  void handlerResult
    .map(action => {
      void action
        .map(data => {
          res
            .status(200)
            .json(
              wrapWithData
                ? {
                    data: JSON.parse(JSON.stringify(data)),
                  }
                : JSON.parse(JSON.stringify(data)),
            )
            .end()
        })
        .mapErr(error => {
          const { status, msg } = mapRouteError(error)
          res.status(status).json({ error: msg }).end()
        })
    })
    .mapErr(parseError => {
      res
        .status(400)
        .json({
          error: `Failed to parse request body: ${parseError}`,
        })
        .end()
    })
}

type RouteHandler<T> = (req: Request) => DecodeResult<DataResult<T>>
type DataResult<T> = ResultAsync<T, RouteError>
type DecodeResult<T> = Result<T, string>
export type Handler = (req: Request, res: Response) => void
