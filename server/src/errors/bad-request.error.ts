export class BadRequestError extends Error {
    status = 400;

    constructor(message: string) {
        super(message);
        this.name = 'Bad Request';
    }
}
