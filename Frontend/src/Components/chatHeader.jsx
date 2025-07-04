import React from 'react';
import { X } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";
import { allUser } from '../Store/fetchAllUser';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = allUser();
    const { onlineUsers } = useAuthStore();
    return (
        <div className='p-2.5 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='relative size-10 rounded-full'>
                            <img src={selectedUser.profilePic || "../../avatar.png"} alt={selectedUser.name} />
                        </div>
                    </div>

                    <div>
                        <h3 className='font-medium'>{selectedUser.name}</h3>
                        <p className='text-sm text-base-content/70'>
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    )
}

export default ChatHeader
