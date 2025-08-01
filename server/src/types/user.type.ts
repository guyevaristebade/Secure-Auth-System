export interface UserInfos {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
    createdAt: Date;
    updatedAt: Date;
    loginAt: Date;
}
