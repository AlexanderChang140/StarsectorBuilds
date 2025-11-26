export class InsertFailedError extends Error {
    constructor(values: any[]) {
        super(`Failed to insert: ${values}`);
        this.name = 'InsertFailedError';
    }
}

export class NotFoundError extends Error {
    constructor(rowName: string, values: any[]) {
        super(`Row not found: ${rowName} with values ${values}`);
        this.name = 'NotFound';
    }
}