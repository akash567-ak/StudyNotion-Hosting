import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa6";
import { TypeAnimation } from "react-type-animation";
import React from 'react'

const CodeBlocks = ({
    position, Heading, subHeading, CTAButton1, CTAButton2, codeBlock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

        {/* Section 1 */}
        <div className="w-[50%] flex flex-col gap-8">
            {Heading}
            <div className="text-richblack-300 font-bold">
                {subHeading}
            </div>

            <div className="flex gap-7 mt-7">
                <CTAButton active={CTAButton1.active} linkto={CTAButton1.linkto}>
                    <div className="flex gap-2 items-center">
                        {CTAButton1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>

                <CTAButton active={CTAButton2.active} linkto={CTAButton2.linkto}>
                        {CTAButton2.btnText}
                </CTAButton>
            </div>

        </div>

        {/* Section 2 */}
        <div className="h-fit flex flex-row text-[10px] w-[100%] py-4 lg:w-[500px]">
            {/*  HW-> BG gradiant */}

            <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                <TypeAnimation 
                    sequence={[codeBlock, 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                    style={
                        {
                            whiteSpace:"pre-line",
                            display:"block",
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
        </div>
    </div>
  )
}

export default CodeBlocks