import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import {apiConnector} from "../../Services/apiConnector";
import { contactusEndpoint } from '../../Services/apis';
import CountryCode from "../../data/countrycode.json"


const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) => {
        console.log("Logging Data", data);
        try {
            setLoading(true);
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
            console.log("Logging Response",response);
            setLoading(false);
        } catch(error) {
            console.log("ERROR:", error.message);
            setLoading(false);
        }
    }

    useEffect( () => {
        if(isSubmitSuccessful) {
            reset({
                email:"",
                firstName:"",
                lastName:"",
                message:"",
                phoneNo:"",
            })
        }
    },[reset, isSubmitSuccessful] );


    
  return (
    <form 
        className='flex flex-col gap-7'
        onSubmit={handleSubmit(submitContactForm)}>

        <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='flex flex-col gap-2 lg:w-[48%] '>
            {/* submit first name */}
                <label htmlFor='firstname' className='lable-style'>First Name</label>
                <input
                    type="text" 
                    name='firstname'
                    id='firstname'
                    placeholder='Enter First Name'
                    className='form-style'
                    {...register("firstname", {required:true})}
                    />
                    {
                        errors.firstname && (
                            <span className='-mt-1 text-[12px] text-yellow-100'>
                                Please enter your name
                            </span>
                        )
                    }
            </div>

            {/* submit last name */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='lastname' className='lable-style'>Last Name</label>
                <input
                    type="text" 
                    name='lastname'
                    id='lastname'
                    placeholder='Enter Last Name'
                    className='form-style'
                    {...register("lastname", {required:true})}
                    />
            </div>
        </div>
            {/* email */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='email' className='lable-style'>Email Address</label>
                <input 
                    type="text"
                    name='email'
                    id='email'
                    placeholder='Enter Email Address'
                    className='form-style'
                    {...register("email", {required:true})}
                    />
                    {
                        errors.email && (
                            <span className='-mt-1 text-[12px] text-yellow-100'>
                                Please Enter your email address
                            </span>
                        )
                    }
            </div>

            {/* Phoneno */}
            <div className='flex flex-col gap-2'>
                <label htmlFor="phonenumber" className='lable-style'>
                    Phone Number
                </label>

                <div className='flex gap-5'>
                    <div className='flex w-[81px] flex-col gap-2'>
                        {/* dropdown */}
                        <select 
                            name="dropdown" 
                            id="dropdown"
                            className='form-style'
                            {...register("Countrycode", {required: true})}
                            >
                                {
                                    CountryCode.map( (element, index) => {
                                        return (
                                            <option key={index} value={element.code}>
                                                {element.code} -{element.country}

                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                            <input
                            type="number"
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='form-style'
                            {...register("phoneNo", 
                                {
                                    required:{value:true, message: "Please Enter Phone Number"}, 
                                    maxLength: {value:12, message:"Invalid Phone Number"}, 
                                    minLength:{value:10, message:"Invalid Phone Number"}
                                
                                })}
                            />
                            </div>
                        </div>
                            {
                                errors.phoneNo && (
                                    <span className='-mt-1 text-[12px] text-yellow-100'>
                                        {errors.phoneNo.message}
                                    </span>
                                )
                            }
                
            </div>

            {/* message */}
            <div className='flex flex-col gap-2'>
                    <label htmlFor="message" className='lable-style'>Message</label>
                    <textArea 
                        name='message'
                        id='message'
                        cols='30'
                        rows="7"
                        placeholder="Enter Your Message"
                        className="form-style"
                        {...register("message", {required:true})}
                        />
                        {
                            errors.message && (
                                <span className='-mt-1 text-[12px] text-yellow-100'>
                                    Please Enter Your Message.
                                </span>
                            )
                        }
            </div>

            <button
                disabled={loading}
                type='submit'
                className={`rounded-md bg-yellow-50 text-center px-6 text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                ${
                    !loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"
                } disabled:bg-richblack-500 sm:text-[16px]`}>
                Send Message
            </button>
        </form>
  )
}

export default ContactUsForm