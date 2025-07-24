export class ConflitError extends Error {
    status = 409;
    constructor(message: string) {
        super(message);
        this.name = 'ConflitError';
    }
}
