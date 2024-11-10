import { context } from './context.js'

export type RouteError =
  | { type: 'BadRequest'; context: string }
  | {
      type: 'ServerError'
      context: string
      error?: Error
    }
  | { type: 'Forbidden'; context?: string }
  | { type: 'Unauthenticated'; context: string }
  | { type: 'ReadError'; context?: string }
  | { type: 'NotFound'; context?: string }
  | { type: 'Other'; error: Error; context?: string }

export function other(error: unknown): RouteError {
  const err =
    error instanceof Error ? error : new Error('A non-error object was thrown.')
  return {
    type: 'Other',
    context: 'Uh oh, there was an unexected error!',
    error: err,
  }
}

export function serverError(context: string, error?: unknown): RouteError {
  const err =
    error instanceof Error ? error : new Error('A non-error object was thrown.')
  return {
    type: 'ServerError',
    context,
    error: err,
  }
}

export function badRequest(context: string): RouteError {
  return {
    type: 'BadRequest',
    context,
  }
}

export function forbidden(context?: string): RouteError {
  return {
    type: 'Forbidden',
    context,
  }
}

export function unauthenticated(context: string): RouteError {
  return {
    type: 'Unauthenticated',
    context,
  }
}

export function readError(context?: string): RouteError {
  return {
    type: 'ReadError',
    context,
  }
}

export function notFound(context?: string): RouteError {
  return {
    type: 'NotFound',
    context,
  }
}

export function mapRouteError(err: RouteError): RouteErrorHttpResponse {
  switch (err.type) {
    case 'BadRequest': {
      return {
        status: 400,
        msg: err.context,
      }
    }
    case 'ServerError':
      return {
        status: 500,
        msg: err.context,
      }
    case 'Forbidden':
      return {
        status: 403,
        msg: 'You are not allowed to reach this resource.',
      }
    case 'Unauthenticated':
      return {
        status: 401,
        msg: `Authentication failed: ${err.context}`,
      }
    case 'ReadError':
      return {
        status: 500,
        msg: err.context ?? 'There occurred a read error for the NATS KV.',
      }
    case 'NotFound':
      return {
        status: 404,
        msg: err.context ?? 'The requested item could not be found.',
      }
    case 'Other': {
      const errorInfo = err.error ? err.error : ''
      context().logger.error(errorInfo)

      return {
        status: 500,
        msg: `An Internal Error Occurred: ${errorInfo}`,
      }
    }
  }
}

type RouteErrorHttpResponse = {
  status: number
  msg: string
}
