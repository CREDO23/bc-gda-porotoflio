interface IClientResponse {
    message: string;
    data: unknown;
    error: unknown;
    success: boolean;
}

interface IUser {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    email: string;
    phoneNumber: string;
    roles: string;
    country: string;
    city: string;
    adress_line1: string;
    adress_line2: string;
}
