import { useState } from 'react';
import axios from '../api/axios.js'; 
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { fullName, email, password, confirmPassword, terms } = formData;

        if (!terms) {
            setError('You must agree to the Terms and Conditions');
            return;
        }

        try {
            const response = await axios.post('/create-account', {
                fullName,
                email,
                password,
                confirmPassword,
            });

            if (response.data.error === false){
                localStorage.setItem('accessToken', response.data.accessToken);
                navigate('/login'); 
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message){
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className='bg-gray-100 flex justify-center items-center h-screen'>
            <div className='border rounded-lg bg-white w-[500px] p-8 shadow'>
                <div>
                    <h1 className='text-3xl font-bold'>Registration Page</h1>
                </div>
                <div className="py-8">
                    <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                        {error && <p className='text-red-500'>{error}</p>}
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-900'>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full p-2.5'
                                placeholder="Hamza Taj"
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-900'>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm outline-none rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-900'>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                                placeholder="Password@123"
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-900'>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                                placeholder="Password@123"
                                required
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id='terms-checkbox'
                                name='terms'
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                className='w-4 h-4 text-blue-600'
                                required
                            />
                            <label htmlFor='terms-checkbox' className='ms-2 text-sm font-medium text-gray-900'>
                                I agree with the
                            </label>
                            <a href="/terms" className='ms-1 cursor-pointer sm font-medium text-blue-600 hover:underline'>
                                Terms and Conditions
                            </a>
                        </div>
                        <div className="btn">
                            <button
                                type="submit"
                                className='w-full p-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700'
                            >
                                Register
                            </button>
                        </div>
                        <div className="flex">
                            <p>Already have an account?</p>
                            <a href="/login" className='ms-1 cursor-pointer sm font-medium text-blue-600 hover:underline'>Login Here</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
