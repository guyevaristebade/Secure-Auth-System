export const authConfig = {
    accessSecret: process.env.ACCESS_TOKEN_SECRET!,
    accessExpireIn: process.env.ACCESS_TOKEN_EXPIRE!,
    RefreshSecret: process.env.ACCESS_TOKEN_SECRET!,
    RefreshExpireIn: process.env.REFRESH_TOKEN_EXPIRE!,
};
