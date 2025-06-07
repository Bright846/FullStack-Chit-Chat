import React, { useState } from 'react';
import { useAuthStore } from '../Store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../Components/AuthImagePattern';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login, isLoggingIn } = useAuthStore();
    const handleLogin = async (e) => {
        e.preventDefault();
        login(formData);
    }
    return (
        <>
            <div className='min-h-screen grid lg:grid-cols-2 '>
                {/* left side */}
                <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                    <div className='w-full max-w-md space-y-8'>
                        <div className='text-center mb-8'>
                            <div className='flex flex-col items-center gap-2 group'>
                                <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                    <MessagesSquare className='size-6 text-primary' />
                                </div>
                                <h1 className='text-2xl font-bold mt-2'>Log In To Your Account</h1>
                                <p className='text-base-content/60'>Welcome Back !!</p>
                            </div>

                        </div>

                        <form onSubmit={handleLogin} className='space-y-6'>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Email</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                                        <Mail className='size-5 text-primary-content/40 ' />
                                    </div>
                                    <input type="email" className='input input-bordered w-full pl-10 z-0' placeholder='Enter Email' value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }} />
                                </div>
                            </div>

                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Password</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                                        <Lock className='size-5 text-primary-content/40 ' />
                                    </div>
                                    <input type={showPassword ? "text" : "password"} className='input input-bordered w-full pl-10 z-0' placeholder='Enter Password' value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} />
                                    <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center z-10' onClick={() => { setShowPassword(!showPassword) }}>
                                        {showPassword ? (<EyeOff className='size-5 text-primary-content/40' />) : <Eye className='size-5 text-primary-content/40' />}
                                    </button>
                                </div>
                            </div>

                            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
                                {
                                    isLoggingIn ?
                                        (<>
                                            <Loader2 className='size-5 animate-spin' />
                                            Logging In....
                                        </>) :
                                        (
                                            "Log In"
                                        )
                                }
                            </button>
                        </form>

                        <div className='text-center'>
                            <p className='text-sm text-gray-600 dark:text-gray-500'>
                                Don't Have An Account ?{" "}
                                <Link to="/signup" className='link link-primary'>
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>

                {/* Right Side */}

                <AuthImagePattern
                    title="Join Our Community"
                    subtitle="Stay Connected With Someone Special...."
                />
            </div>
        </>
    )
}

export default LoginPage;