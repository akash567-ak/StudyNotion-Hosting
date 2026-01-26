import React from 'react'
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import { FooterLink2 } from "../../../src/data/footer-links";


// Icons
import { FaFacebookF , FaGoogle, FaYoutube } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const BottomFooter = ["Privacy policy", "Cookie Policy", "Terms"];
const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code Challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
]
const Plans = ["Paid memberships", "For Students", "Business Solutions"];
const Community = [ "Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className='bg-richblack-800'>
        <div className='flex w-11/12 lg:flex-row gap-8 items-center justify-between max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14'>
            <div className='border-b w-[100%] flex flex-col lg:flex-row pb-5 border-richblack-700'>

                {/* section 1 */}
                <div className='lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3'>
                    <div className='w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0'>
                        <img src={Logo} alt="" 
                        className='object-contain' 
                        />
                        <h1 className='text-richblack-50 font-semibold text-[16px]'>
                            Company
                        </h1>
                        <div className='flex flex-col gap-2'>
                            {["About", "Careers", "Affiliates"].map((ele, i) => {
                                return  (
                                    <div 
                                    key={i}
                                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'
                                    >
                                    <Link to={ele.toLowerCase()}>{ele}</Link>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex gap-3 text-lg'>
                            <div className='hover:text-richblack-50 cursor-pointer'>
                                <FaFacebookF />
                            </div>
                            <div className='hover:text-richblack-50 cursor-pointer'>
                                <FaGoogle />
                            </div>
                            <div className='hover:text-richblack-50 cursor-pointer'>
                                <RiTwitterXLine />
                            </div>
                            <div className='hover:text-richblack-50 cursor-pointer'>
                                <FaYoutube />
                            </div>
                        </div>
                    </div>


                    <div className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
                        <h1 className='text-richblack-50 font-semibold text-[16px]'>
                            Resources
                        </h1>

                        <div className='flex flex-col gap-2 mt-2'>
                            {Resources.map((ele, index) => {
                                return (
                                    <div 
                                    key={index}
                                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                                    
                                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                                        {ele}
                                    </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <h1 className='text-richblack-50 font-semibold text-[16px] mt-7'>
                            Support
                        </h1>
                        <div className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2'>
                           <Link to={"/help-center"}>Help Center</Link> 
                        </div>
                    </div>

                    {/* Plans */}
                    <div className='w-[48px] lg:w-[30%] mb-7 lg:pl-0'>
                        <h1 className='text-richblack-50 font-semibold text-[16px] mb-1'>
                            Plans
                        </h1>

                        <div className='flex flex-col gap-2 mt-2'>
                        {Plans.map((ele, index) => {
                            return (
                                <div 
                                key={index}
                                className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'
                                >
                                    <Link to={ele.split(" ").join("-").toLowerCase()}>
                                    {ele}
                                    </Link>
                                </div>
                            );
                        })}
                        </div>


                        {/* Community */}
                        <div className='w-[48px] lg:w-[30%] mb-1 lg:pl-0 pt-10'>
                            <h1 className='text-richblack-50 font-semibold text-[16px]'
                            >Community</h1>
                        </div>

                        <div className='flex flex-col gap-2 pt-2'>
                                {Community.map((ele, index) => {
                                    return (
                                        <div
                                        key={index}
                                        className= 'hover:text-richblack-50 text-[14px] transition-all duration-200'>
                                            <Link to={ele.split(" ").join("-").toLowerCase()}>
                                            {ele}
                                            </Link>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>    
                </div>


                {/* Section 2 */}
                <div className='lg:w-[50%] flex flex-wrap  justify-between pl-3 lg:pl-12 gap-3'>
                    {FooterLink2.map((ele, index) => {
                        return (
                            <div
                            key={index}
                            className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'
                            >
                                <h1 className='text-richblack-50 font-semibold text-[16px]'>
                                    {ele.title}
                                </h1>

                                <div className='flex flex-col gap-2 mt-2'>
                                    {ele.links.map((link, index) => {
                                        return (
                                            <div
                                            key={index}
                                            className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200
                                            '
                                            >
                                                <Link to={link.link}>
                                                {link.title}                               
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
        
         
            {/* Section 1 "Privacy Policy" */}
            <div className='flex items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm'>
                <div className='flex lg:items-start justify-between lg:flex-row gap-3 w-full'>
                <div className='flex flex-row'>
                    {BottomFooter.map((ele, index) => {
                        return (
                            <div
                            key={index}
                            className={` ${
                                BottomFooter.length - 1 === index
                                ? "" : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                            } px-3 `}
                            >
                                <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                                {ele}
                                </Link>
                            </div>
                        )
                    })}
                </div>

                <div className='text-center'>Made with ❤️ CodeHelp © 2023 Studynotion </div>
            </div>
        </div>        
    </div>
  )
}

export default Footer