import { ResultAsync } from 'neverthrow';
import { z, ZodIssue } from 'zod';

import { other, RouteError } from './errors.js';

export function parseEnv<S extends z.ZodRawShape, T extends EnvSchema<S>>(
  schema: T,
): z.infer<T> {
  const result = schema.safeParse(process.env);
  if (!result.success) {
    throw new Error(
      `Error loading env-file! \n${formatIssues(result.error.issues)}`,
    );
  }
  return result.data;
}

export function resultFromPromise<T>(
  promise: PromiseLike<{ data: T }>,
): RouteResult<T> {
  return ResultAsync.fromPromise(promise, e => other(e));
}
export function dataResultFromPromise<T>(
  f: () => PromiseLike<T>,
  errCallback: (e: unknown) => RouteError = e => other(e),
): DataResult<T> {
  return ResultAsync.fromPromise(f(), e => errCallback(e));
}

export function parseZodIssues(zodIssues: ZodIssue[]): string {
  const stringifiedIssues = zodIssues.map(
    issue => `${issue.path.toString()}: ${issue.message}`,
  );
  return stringifiedIssues.join(', ');
}

function formatIssues(issues: ZodIssue[]): string {
  return issues
    .map(issue => `[${issue.path.toString()}]: ${issue.message}`)
    .join('\n');
}

type EnvSchema<T extends z.ZodRawShape> = z.ZodType<z.infer<z.ZodObject<T>>>;
export type DataResult<T> = ResultAsync<T, RouteError>;
export type RouteResult<T> = ResultAsync<{ data: T }, RouteError>;
