import { Alert, Button, Label, Spinner, TextInput, Toast } from "flowbite-react";
import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { HiEye, HiEyeOff, HiFire, HiInformationCircle, HiMail } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from '../axios/axios';
import { loginFailure, loginSuccess, start } from "../redux/user/userSlice";
import OAuth from "./OAuth";

const customTheme = {
  field: {
      colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 text-2xl",
      },
  input: {
      sizes: {
          lg: "sm:text-md p-4 font-semibold font-tf rounded-full dark:bg-gray-800 dark:text-gray-200"
        },
        withAddon: {
          "off": "rounded-full"
        },
  },
},
  size: {
    lg: "text-xl font-serif px-5 py-2.5"
  }
};

const SignIn = () => {
  const [formData, setFormData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error, loading, currentUser} = useSelector(state => state.user);

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch(start());
    try {
      const response = await api.post('/auth/login', formData);
      if(response.status === 200) {
        dispatch(loginSuccess(response?.data));
        setTimeout(() => {
          navigate('/')
      }, 3000);
      } else {
        dispatch(loginFailure(response?.data.msg));
      }

    } catch (error) {
      dispatch(loginFailure(error.response?.data.msg));
    }
  }

  setTimeout(() => {
    dispatch(loginFailure(''));
  }, 2200);

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl mx-auto flex-col gap-4 p-4 bg-[#a2a2e3] dark:bg-[#262665] dark:text-[#ece9f3] my-10 rounded-xl py-4">
      {error &&   <Alert color="failure" icon={HiInformationCircle} className="font-semibold font-serif">
      <span className="font-semibold font-tf">Info alert!</span> {error}
    </Alert>}
      { currentUser &&
        <Toast className="mb-3 mx-auto">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200 ">
        <HiFire className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-semibold font-tf">Welcome, {currentUser.username}!</div>
      <Toast.Toggle />
    </Toast>
    }
      <h3 className="text-4xl font-bold font-tf text-center">SignIn</h3>
      <p className="text-md font-semibold text-center">Don't have an account <Link to={'/register'} className="text-blue-800 dark:text-[#8dbebe] dark:hover:text-blue-300 underline hover:text-blue-500">Sign-up</Link>?</p>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" className="md:text-xl text-lg font-serif font-bold" value="Your email" />
        </div>
        <TextInput id="email" type="email" icon={HiMail} sizing={'lg'} color={customTheme} theme={customTheme}  placeholder="name@gmail.com" onChange={handleChange} required />
      </div>
      <div className="relative">
        <div className="mb-2 block">
          <Label htmlFor="password" className="md:text-xl text-lg font-serif font-bold" value="Your password" />
        </div>
        <TextInput id="password" sizing={'lg'} icon={RiLockPasswordFill} color={customTheme} theme={customTheme} placeholder="********" type={showPassword ? "text" : "password"} onChange={handleChange} required />
        <span className="absolute top-12 right-3 text-xl cursor-pointer h-9 w-9 hover:text-blue-300 hover:bg-gray-600 hover:rounded-full p-2" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiEye/> :  <HiEyeOff/> }</span>
      </div>
      <Button type="submit" color={'blue'}  theme={customTheme} disabled={loading} size={'lg'} pill>{loading ? <> <Spinner aria-label="Alternate spinner button example" size="sm" />
        <span className="pl-3">processing...</span> </> : 'Signin'} <span className="ml-2">{<FiLogIn/>}</span></Button>

     {/* Google Option */}
     <div className="inline-flex items-center justify-center w-full">
    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
    </div>
     <OAuth />
    </form>
  )
}

export default SignIn
