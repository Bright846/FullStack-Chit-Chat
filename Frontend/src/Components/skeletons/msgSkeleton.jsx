import React from 'react'

const MsgSkeleton = () => {
    const skeletonMsgs = Array(6).fill(null);
    return (
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {skeletonMsgs.map((_, id) => {
                return (
                    <div key={id} className={`chat ${id % 2 === 0 ? "chat-start" : "chat-end"}`}>
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full'>
                                <div className='skeleton w-full h-full rounded-full' />
                            </div>
                        </div>

                        <div className='chat-header mb-1'>
                            <div className='skeleton w-16 h-4' />
                        </div>

                        <div className='chat-bubble bg-transparent p-0'>
                            <div className='skeleton h-16 w-[200px]' />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MsgSkeleton;
