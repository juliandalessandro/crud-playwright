export interface User {
    username: string;
    email: string;
    password: string;
    description: string;
}

export const validUser: User[] = [
    {
        username: 'user1',
        email: "user1@gmail.com",
        password: 'user1pwd',
        description: 'Valid User',
        
    }
]

export const invalidUser: User[] = [
    {
        username: 'user1',
        email: "user1@gmail.com",
        password: 'user2pwd',
        description: 'Invalid User',
        
    }
]

export const nonExistentUser: User[] = [
    {
        username: 'user0',
        email: "user0@gmail.com",
        password: 'user0pwd',
        description: 'Non-existent User',
        
    }
]

export const LOGIN_MESSAGES = {
    
    LOGIN_SUCCESS: 'Login successful ✅',
    INVALID_CREDENTIALS: 'Invalid credentials ❌',
    
    EMPTY_EMAIL_USERNAME: 'Email or username is required',
    INVALID_EMAIL_USERNAME: 'Enter a valid email or username',
    
    
    EMPTY_PASSWORD: 'Password is required',
    SHORT_PASSWORD: 'Password must be at least 6 characters',
    LONG_PASSWORD: 'Password is too long'

} as const;