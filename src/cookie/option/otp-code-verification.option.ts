export const OTP_CODE_VERIFICATION_COOKIE_OPTION = {
    path: "/auth/verify-otp",
    maxAge: 1000 * 60 * 2,
    httpOnly: true,
    signed: true,
};
