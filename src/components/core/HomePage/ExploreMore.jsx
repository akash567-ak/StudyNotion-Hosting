import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from './HighlightText';
import CourseCard from "../HomePage/CourseCard";

const tabsName= [
    "Free",
    "New to coding",
    "Most populate",
    "Skill paths",
    "Career paths",
]


const ExploreMore = () => {

    const [currentTab, setCurrentTab]= useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(
        HomePageExplore[0].courses[0].heading
    );
    
    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading[0]);
    }


  return (
    <div>
       <div>
        <div className='font-semibold text-4xl text-center my-10'>
            Unlock the 
            <HighlightText text={"Power of code"}/>
        <p className='text-center text-richblack-300 text-sm pt-3 '>
            Learn to build anything you can imagine
        </p>
      </div>
    </div>

    {/* Tabs Section */}
        <div className='mt-5 flex rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1 '>
            {
                tabsName.map((ele, index) => {
                    return (
                        <div
                        key={index}
                        className={`text-[16px] flex items-center gp-2 ${currentTab === ele ? "bg-richblack-900 text-richblack-5 font-medium" 
                        : "text-richblack-200" } rounded-full transition-all duration-200 px-7 py-2 hover:bg-richblack-900 hover:text-richblack-5 cursor-pointer`}
                        onClick={() => setMyCards(ele)}
                        >
                        {ele}
                        </div>
                    );
                })
            }
        </div>


        <div className='hidden lg:h-[200px] lg:block'></div>

        {/* Course Card ka group */}
        <div className='lg:absolute flex flex-wrap gap-10 lg:gap-0 w-full 
            justify-center lg:justify-between lg:bottom-[0] lg:left-[50%] 
            lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
            {
                courses.map((ele,index) => {
                    return (
                        <CourseCard 
                        key= {index}
                        cardData={ele}
                        currentCard={currentCard}
                        setCurrentCard={setCurrentCard}
                        />
                    );
                })}
        </div>
    </div>
  );
};

export default ExploreMore;