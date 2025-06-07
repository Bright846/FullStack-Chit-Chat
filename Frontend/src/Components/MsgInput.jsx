import React, { useRef, useState } from 'react'
import { allUser } from '../Store/fetchAllUser';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MsgInput = () => {
    const [text, setText] = useState("");
    const [imgPreview, setImgPreview] = useState(null);
    const fileInpRef = useRef(null);
    const { sendMsg, selectedUser, getMsg } = allUser();

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please Select Image File !!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImgPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const removeImg = () => {
        setImgPreview(null);
        if (fileInpRef.current) {
            fileInpRef.current.value = "";
        }
    }

    const handleMsgSend = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imgPreview) return;
        try {
            await sendMsg({
                text: text.trim(),
                image: imgPreview
            });
            await getMsg(selectedUser._id);
            setText("");
            setImgPreview(null);
            if (fileInpRef.current) {
                fileInpRef.current.value = "";
            }

        } catch (error) {
            console.error("Failed to send message", error);
        }
    }
    return (
        <div className='p-4 w-full'>
            {imgPreview && (
                <div className='mb-3 flex items-center gap-3'>
                    <div className='relative'>
                        <img src={imgPreview} alt="Preview" className='size-20 object-cover rounded-lg border border-zinc-700' />
                        <button onClick={removeImg} type='button' className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center'>
                            <X className='size-3' />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleMsgSend} className='flex items-center gap-2'>
                <div className='flex-1 flex gap-2'>
                    <input type="text" className='w-full input input-bordered rounded-lg input-sm sm:input-md' placeholder='Type A Message....' value={text} onChange={(e) => { setText(e.target.value) }} />
                    <input type="file" accept='image/*' className='hidden' ref={fileInpRef} onChange={handleImgChange} />
                    <button className={`hidden sm:flex btn btn-circle ${imgPreview ? "text-emerald-500" : "text-zinc-400"}`} type='button' onClick={() => fileInpRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>

                <button type="submit" className='btn btn-sm btn-circle' disabled={!text.trim() && !imgPreview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MsgInput;
