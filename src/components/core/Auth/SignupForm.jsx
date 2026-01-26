import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { toast } from 'react-hot-toast';

import { sendOtp } from '../../../Services/operations/authAPI';
import { useDispatch } from 'react-redux';
import { setSignupData } from '../../../slices/authSlice';
import Tab from "../../../components/common/Tab"
import { ACCOUNT_TYPE } from '../../../utils/constants';

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  //Student or instructor
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { firstName, lastName, email, password, confirmPassword} = formData
    function handleOnChange(e) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }))
    }

    //Handle Form Submission
    function handleOnSubmit(e) {
      e.preventDefault()

      if (password !== confirmPassword) {
        toast.error("Password Not Match")
        return
      }
      const signupData = {
        ...formData,
        accountType,
      }

      //setting signup data to state
    //to be used after otp verification
    dispatch(setSignupData(signupData))
    //Send OTP to User for verification
    dispatch(sendOtp(formData.email, navigate))

    //Reset
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setAccountType(ACCOUNT_TYPE.STUDENT)
  }

  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ]
   
  return (
    <div>
      {/* Tab */}
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      {/* Form */}
      {/* student-instructor tab */}
      <form onSubmit={handleOnSubmit} className='flex w-full flex-col gap-y-4'>
      {/* firstname and lastname */}
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup></p>
            <input
              type="text"
              required
              value={firstName}
              name="firstName"
              onChange={handleOnChange}
              placeholder="Enter First Name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full bg-richblack-800 rounded-[0.5rem] text-richblack-5  p-[12px]"
            />
          </label>

          <label>
            <p className="mb-1 leading-[1.375rem] text-[0.875rem] text-richblack-5 ">
              Last Name <sup className="text-pink-200">*</sup>{" "}
            </p>
            <input
              required
              type="text"
              value={lastName}
              name="lastName"
              onChange={handleOnChange}
              placeholder="Enter Last Name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
        </div>

        {/* email address */}
        <div>
          <label className="w-full">
          <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
            Email Address <sup className="text-pink-200"> *</sup>
          </p>
          <input
            type="email"
            required
            value={email}
            name="email"
            onChange={handleOnChange}
            placeholder="Enter Email Address"
            style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
          />
        </label>
        </div>
        

        {/* Createpassword and confirm password */}
        <div className="flex gap-x-4 ">
          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? ("text") : ("password")}
              value={password}
              name="password"
              onChange={handleOnChange}
              placeholder="Enter Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)}
            </span>
          </label>


          <label className="relative">
            <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showConfirmPassword ? ("text") : ("password")}
              required
              value={confirmPassword}
              name="confirmPassword"
              onChange={handleOnChange}
              placeholder="confirm Password"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              onClick={() => {
                setShowConfirmPassword((prev) => !prev);
              }}
            >
              {showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)}
            </span>
          </label>
        </div>

        <button 
          type='submit'
          className="bg-yellow-50 rounded-[8px] w-full font-medium text-richblack-900 px-[12px] py-[8px] mt-6">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default SignupForm;