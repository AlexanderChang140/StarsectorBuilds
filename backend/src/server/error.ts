import { Status } from './constants/http.ts';

export abstract class AppError extends Error {
    abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends AppError {
    readonly statusCode = Status.BAD_REQUEST;
}

export class NotFoundError extends AppError {
    readonly statusCode = Status.NOT_FOUND;
}

export class ConflictError extends AppError {
    readonly statusCode = Status.CONFLICT;
}

export class UnauthorizedError extends AppError {
    readonly statusCode = Status.UNAUTHORIZED;
}

export class DatabaseError extends AppError {
    readonly statusCode = Status.INTERNAL_SERVER_ERROR;

    constructor(message = 'A database error occurred') {
        super(message);
    }
}
