import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const setAuthToken = (token) => {
    console.log('Token received in setAuthToken:', token); // Tambahan debug
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);

        try {
            const decodedToken = jwtDecode(token);
            
            localStorage.setItem('userRole', decodedToken.role);
            localStorage.setItem('userGmail', decodedToken.gmail);
            console.log('--- DEBUG: Decoded Token Payload ---');
            console.log(decodedToken); // <--- Ini akan menampilkan SELURUH payload
            console.log('Is "gmail" property present in decodedToken?', 'gmail' in decodedToken); // Cek apakah properti 'gmail' ada
            console.log('Value of decodedToken.gmail:', decodedToken.gmail); // Nilai dari properti 'gmail'
            console.log('Decoded Token:', decodedToken);
            console.log('Gmail:', decodedToken.gmail);
        } catch (error) {
            console.error('Failed to decode token or set user info:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userGmail');
            delete axios.defaults.headers.common['Authorization'];
        }
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userGmail');
    }
};


export const loadAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        setAuthToken(token);
    }
};

export const isLoggedIn = () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return false;
        }
        const decodedToken = jwtDecode(token);
        const isTokenValid = decodedToken.exp * 1000 >= Date.now();

        if (!isTokenValid) {
            setAuthToken(null);
        }
        return isTokenValid;
    } catch (error) {
        console.error("Error validating token:", error);
        setAuthToken(null);
        return false;
    }
};

export const logout = () => {
    setAuthToken(null);
};

export const getUserRole = () => {
    return localStorage.getItem('userRole');
};

export const getUserGmail = () => {
    return localStorage.getItem('userGmail');
};