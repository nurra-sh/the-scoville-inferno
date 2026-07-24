export interface LoginBody {
    email: string
    password: string
}

export interface LoginResponse {
    type: 'bearer'
    token: string
    user: User;
    message: string
}

export interface User {
    id: number
    fullName: string
    email: string
    createdAt: string
    updatedAt: string
}

export interface RegisterBody {
    email: string;
    password: string;
    password_confirmation: string;
    fullName: string;
}

export interface RegisterResponse {
    message: string
}

export interface GetMeResponse {
    user: User
}