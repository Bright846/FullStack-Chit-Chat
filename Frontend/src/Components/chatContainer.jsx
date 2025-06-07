import React, { useEffect, useRef } from 'react';
import { allUser } from "../Store/fetchAllUser.js";
import ChatHeader from './chatHeader.jsx';
import MsgInput from './MsgInput.jsx';
import MsgSkeleton from './skeletons/msgSkeleton.jsx';
import { useAuthStore } from '../Store/useAuthStore.js';
import { formatMsgDate } from '../lib/utils.js';

const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
};

const ChatContainer = () => {
    const { messages, getMsg, isMsgLoading, selectedUser, subscribeToMsg, unSubscribeToMsg } = allUser();
    const { authUser } = useAuthStore();
    const endRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMsg(selectedUser._id);
        }
        subscribeToMsg();
        return () => unSubscribeToMsg();
    }, [selectedUser?._id, getMsg, subscribeToMsg, unSubscribeToMsg]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isMsgLoading) return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <MsgSkeleton />
            <MsgInput />
        </div>
    );

    let lastDate = null;

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((msg, idx) => {
                    const msgDate = new Date(msg.createdAt).toDateString();
                    const showDateHeader = msgDate !== lastDate;
                    lastDate = msgDate;
                    return (
                        <React.Fragment key={msg._id}>
                            {showDateHeader && (
                                <div className="flex justify-center my-2">
                                    <span className="px-4 py-1 rounded-full bg-base-200 text-xs text-base-content/70">
                                        {formatDateHeader(msg.createdAt)}
                                    </span>
                                </div>
                            )}
                            <div className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                                <div className='chat-image avatar'>
                                    <div className='size-10 rounded-full border'>
                                        <img src={msg.senderId === authUser._id ? authUser.profilePic || "../../avatar.png" : selectedUser.profilePic || "../../avatar.png"} alt="Profile Pic" />
                                    </div>
                                </div>
                                <div className='chat-header mb-1'>
                                    <time className='text-sm opacity-50 ml-1'>
                                        {formatMsgDate(msg.createdAt)}
                                    </time>
                                </div>
                                <div className='chat-bubble flex flex-col'>
                                    {msg.image && (
                                        <div className="relative">
                                            <img src={msg.image} alt="Attachment" className='sm:max-w-[200px] rounded-md mb-2 opacity-90' />
                                        </div>
                                    )}

                                    {msg.text && <p>{msg.text}</p>}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={endRef} />
            </div>
            <MsgInput />
        </div>
    );
};

export default ChatContainer;
