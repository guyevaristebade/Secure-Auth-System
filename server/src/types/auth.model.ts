export interface userPayload {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface DecodedToken {
    userId: string;
}
