// src/provider/AuthProvider.js
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMe } from '../services/UserService'; // Import getMe

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        role: null,
        token: null,
        username: null, // Thêm trường username
        userId: null,   // Thêm userId nếu cần
    });
    const [loadingAuth, setLoadingAuth] = useState(true); // Thêm state loading

    const fetchAndSetUser = useCallback(async () => {
        try {
            const userInfo = await getMe();
            setAuth(prevAuth => ({
                ...prevAuth, // Giữ lại token và role đã có
                isAuthenticated: true,
                username: userInfo.data.username, // Lấy username từ response
                userId: userInfo.data._id,       // Lấy userId
                role: userInfo.data.role?.name || prevAuth.role, // Cập nhật role từ getMe nếu có
            }));
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            // Nếu lỗi (ví dụ token hết hạn), đăng xuất
            logout();
        } finally {
             setLoadingAuth(false); // Đánh dấu là đã load xong
        }
    }, []); // useCallback để không tạo lại hàm mỗi lần render

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        // const role = sessionStorage.getItem('role'); // Không cần role ở đây nữa vì sẽ lấy từ getMe
        if (token) {
            // Đặt token và role tạm thời (nếu muốn UI phản hồi nhanh)
             setAuth(prev => ({ ...prev, token, isAuthenticated: true /*, role: role */ }));
            // Gọi API để lấy thông tin user đầy đủ
            fetchAndSetUser();
        } else {
            setLoadingAuth(false); // Không có token, không cần load
        }
    }, [fetchAndSetUser]); // Thêm fetchAndSetUser vào dependency array

    const saveToken = (token, role) => { // Giữ lại role ở đây vì LoginModal cung cấp
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role); // Vẫn lưu role vào session nếu cần dùng ngay
         setAuth(prev => ({ // Cập nhật state ngay lập tức với thông tin cơ bản
             ...prev,
            isAuthenticated: true,
            token,
            role,
         }));
        // Gọi API để lấy thông tin chi tiết (bao gồm username)
        fetchAndSetUser();
    };

    const logout = () => {
        sessionStorage.clear();
        setAuth({
            isAuthenticated: false,
            role: null,
            token: null,
            username: null, // Reset username
            userId: null,   // Reset userId
        });
    };

    // Chỉ render children khi không còn loading auth
    if (loadingAuth) {
         // Optional: Bạn có thể hiển thị một spinner toàn trang ở đây
         return <div>Loading Authentication...</div>; // Hoặc một spinner component
    }


    return (
        <AuthContext.Provider value={{ auth, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dùng ở mọi nơi
export const useAuth = () => useContext(AuthContext);