import React from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Autoplay, Pagination, Navigation} from "swiper/modules"
import CourseCard from './CourseCard'


const CourseSlider = ({Courses}) => {
  return (
    <>
      {
        Courses?.length ? (
          <Swiper
            slidesPerView={1}
            loop={false} 
            spaceBetween={200}
            autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
            pagination={true}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            1024:{slidesPerView:3}
          }}
          className='max-h-[30rem]'
          >
            {
              Courses?.map((course, index) => (
                <SwiperSlide key={index}>
                  <CourseCard course={course} Height={"h-[250px]"}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className='text-xl text-richblack-5'>No Course Found</p>
        )
      }
    </>
  )
}

export default CourseSlider