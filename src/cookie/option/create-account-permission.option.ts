export const CREATE_ACCOUNT_PERMISSION_COOKIE_OPTION = {
    path: "/user/create-account",
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    signed: true,
};
