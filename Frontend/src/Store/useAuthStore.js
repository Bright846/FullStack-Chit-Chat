import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const Base_Url = import.meta.env.MODE === "DEVELOPMENT" ? 'http://localhost:1007' : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSignningUp: false,
    isLoggingIn: false,
    isUpdattingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/api/check');
            // Only set if user object exists and has an _id
            if (res.data && res.data._id) {
                set({ authUser: res.data });
                get().connectSocket();
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            console.log("Error in checking auth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },


    signup: async (data) => {
        set({ isSignningUp: true })
        try {
            const res = await axiosInstance.post('/api/signup', data);
            set({ authUser: res.data });
            toast.success("Account Created Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSignningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post('/api/login', data);
            set({ authUser: res.data });
            toast.success("Logged In Successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/api/logout');
            set({ authUser: null });
            toast.success("Logged Out Successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdattingProfile: true });
        try {
            const res = await axiosInstance.put('/api/update-profile', data);
            set({ authUser: res.data });
            toast.success("Profile Updated Successfully");
        } catch (error) {
            console.log("Error in updating Profile", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdattingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(Base_Url, {
            query: { userId: authUser._id }
        });
        socket.connect();
        set({ socket: socket });

        socket.on("onlineUsers", (user) => {
            set({ onlineUsers: user });
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));