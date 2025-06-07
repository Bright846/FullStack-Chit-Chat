// fetchAllUser.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

let newMsgHandler = null;

export const allUser = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMsgLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/api/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMsg: async (userId) => {
        set({ isMsgLoading: true });
        try {
            const res = await axiosInstance.get(`/api/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMsgLoading: false });
        }
    },

    sendMsg: async (msgData) => {
        const { selectedUser } = get();
        const { authUser } = useAuthStore.getState();
        if (!selectedUser?._id) {
            toast.error("No user selected");
            return;
        }

        const tempId = Date.now().toString();
        const tempMsg = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            image: msgData.file ? URL.createObjectURL(msgData.file) : null,
            text: msgData.text || "",
            createdAt: new Date().toISOString(),
            status: "uploading"
        };
        set(state => ({ messages: [...state.messages, tempMsg] }));

        try {
            const res = await axiosInstance.post(`/api/message/send/${selectedUser._id}`, msgData);
            set(state => ({
                messages: state.messages.map(m => m._id === tempId ? res.data : m)
            }));
        } catch (error) {
            set(state => ({
                messages: state.messages.filter(m => m._id !== tempId)
            }));
            toast.error("Failed to send image");
        }
    },


    subscribeToMsg: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        // Remove any existing handler before adding a new one
        if (newMsgHandler) socket.off("newMsg", newMsgHandler);



        newMsgHandler = (newMsg) => {

            if (newMsg.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMsg],
            });
        };
        socket.on("newMsg", newMsgHandler);
    },

    unSubscribeToMsg: () => {
        const socket = useAuthStore.getState().socket;
        if (newMsgHandler) {
            socket.off("newMsg", newMsgHandler);
            newMsgHandler = null;
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
