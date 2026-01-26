import React from "react";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignupForm = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("student");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value
      };
    });
  }
  function submitHandler(event) {
    event.preventDefault();
    if(formData.password !== formData.confirmPassword) {
        toast.error("passwords do not match");
        return;
    }

    setIsLoggedIn(true);
    toast.success("Account Created");
    const accountData = {
      ...formData
    };
    const finalData = {
      ...accountData,
      accountType
    }

    console.log("Printing final account data");
    // console.log(accountData);
    console.log(finalData);

    navigate("/dashboard");
  }

  return (
    <div className="">
      {/* student-instructor tab */}
      <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
        <button className={`${accountType === "student" ? "bg-richblack-900 text-richblack-5" : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
        onClick={() => {
          setAccountType("student");
        }}>
          Student</button>

        <button className={`${accountType === "instructor" ? "bg-richblack-900 text-richblack-5" : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
        onClick={() => {
          setAccountType("instructor");
        }}>
          Instructor</button>
      </div>

      <form onSubmit={submitHandler}>
        {/* firstname and lastname */}
        <div className="flex gap-x-4 mt-[10px]">
          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mt-1 leading-[1.375rem]">
              First Name <sup className="text-pink-200">*</sup></p>
            <input
              type="text"
              required
              value={formData.firstName}
              name="firstName"
              onChange={changeHandler}
              placeholder="Enter First Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>

          <label className="w-full">
            <p className="text-[0.875rem] text-richblack-5 mt-1 leading-[1.375rem]">
              Last Name <sup className="text-pink-200">*</sup>{" "}
            </p>
            <input
              required
              type="text"
              value={formData.lastName}
              name="lastName"
              onChange={changeHandler}
              placeholder="Enter Last Name"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
          </label>
        </div>

        {/* email address */}
        <div className="mt-[20px]">
          <label className="w-full mt-[10px] ">
          <p className="text-[0.875rem] text-richblack-5 mt-1 leading-[1.375rem]">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            type="email"
            required
            value={formData.email}
            name="email"
            onChange={changeHandler}
            placeholder="Enter Email Address"
            className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
          />
        </label>
        </div>
        

        {/* Createpassword and confirm password */}
        <div className="w-full flex gap-x-4 mt-[20px]">
          <label className="relative w-full">
            <p className="text-[0.875rem] text-richblack-5 mt-1 leading-[1.375rem]">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? ("text") : ("password")}
              value={formData.password}
              name="password"
              onChange={changeHandler}
              placeholder="Enter Password"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            >
              {showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)}
            </span>
          </label>


          <label className=" relative w-full">
            <p className="text-[0.875rem] text-richblack-5 mt-1 leading-[1.375rem]">
              Confirm Password<sup className="text-pink-200">*</sup>
            </p>
            <input
              type={showConfirmPassword ? ("text") : ("password")}
              required
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={changeHandler}
              placeholder="confirm Password"
              className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px]"
            />
            <span className="absolute right-3 top-[38px] cursor-pointer"
              onClick={() => {
                setShowConfirmPassword((prev) => !prev);
              }}
            >
              {showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />) : (<AiOutlineEye fontSize={24} fill="#AFB2BF" />)}
            </span>
          </label>
        </div>

        <button className="bg-yellow-50 rounded-[8px] w-full font-medium text-black px-[12px] py-[8px] mt-6">
          Create Account
        </button>
      
      </form>
    </div>
  );
};

export default SignupForm;
