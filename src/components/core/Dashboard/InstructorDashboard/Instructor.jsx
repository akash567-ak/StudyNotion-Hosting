import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../Services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../Services/operations/ProfileAPI';
import { Link } from 'react-router-dom';
import InstructorChart from './InstructorChart';

const Instructor = () => {

    const [loading, setLoading] = useState(false);
    const {user} = useSelector((state) => state.profile);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);
    const {token} = useSelector((state) => state.auth);
    
    
    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);

            const instructorApiData = await getInstructorData(token);
            const  result = await fetchInstructorCourses(token);

            console.log(instructorApiData)
            if (instructorApiData.length) 
                setInstructorData(instructorApiData)
            
            if (result) {
                setCourses(result);
            }
            setLoading(false);
        } 
        getCourseDataWithStats();
    },[token])

    const totalAmount = instructorData?.reduce((acc,curr) => acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr) => acc + curr.totalStudentsEnrolled, 0)

  return (
    <div>
       <div className='space-y-2'>
        <h1 className='text-2xl font-bold text-richblack-5'>Hi {user?.firstName} 👋</h1>
        <p className='font-medium text-richblack-200'>Let's Start Different New</p>
       </div>

       {loading 
        ? (<div className='spinner'></div>) 
        :courses.length > 0
            ? (<div>
                <div className='my-4 flex h-[450px] space-x-4'>
                    {/* Rebnder chart / graph */}
                    {totalAmount > 0 || totalStudents > 0 ? (
                        <InstructorChart courses={instructorData} />
                    ) : (
                        <div className='flex-1 rounded-md bg-richblack-800 p-6'>
                            <p className='text-lg font-bold text-richblack-5'>Visualize</p>
                            <p className='mt-4 text-xl font-medium text-richblack-50'>
                                Not Enough Data To Visualize
                            </p>
                        </div>
                    )}
                    
                    {/* Total Statistics */}
                    <div className='flex min-h-[250px] flex-col rounded-md bg-richblack-800 p-6'>
                        <p className='text-lg font-bold text-richblack-5'>Statistics</p>
                        <div className='mt-4 space-y-4'>
                            <div>
                                <p className='text-lg text-richblack-200'>Total Courses</p>
                                <p className='text-3xl font-semibold text-richblack-50'>{courses.length}</p>
                            </div>
                        </div>
                        <div>
                            <p className='text-lg text-richblack-200'>Total Students</p>
                            <p className='text-3xl font-semibold text-richblack-50'>{totalStudents}</p>
                        </div>
                        <div>
                            <p className='text-lg text-richblack-200'>Total Income</p>
                            <p className='text-3xl font-semibold text-richblack-50'>{totalAmount}</p>
                        </div>
                    </div>
                </div>
            <div className='rounded-md bg-richblack-800 p-6'>
                {/* Render 3 Courses */}
                <div className='flex items-center justify-between'>
                    <p className='text-lg font-bold text-richblack-5'>Your Courses</p>
                    <Link to="/dashboard/my-courses">
                        <p className='text-x font-semibold text-yellow-100'>View All</p>
                    </Link>
                </div>
                <div className='my-4 flex items-start space-x-6'>
                    {
                        courses.slice(0,3).map((course) => (
                            <div key={course._id} className='w-1/3'>
                                <img 
                                    src={course.thumbnail} 
                                    alt={course.courseName} 
                                    className='h-[201px] w-full rounded-md object-cover'
                                />
                                <div className='mt-3 w-full'>
                                    <p className='text-sm font-medium text-richblack-50'>
                                        {course.courseName}
                                    </p>
                                    <div className='mt-1 flex items-center space-x-2'>
                                        <p className='text-xs font-medium text-richblack-300'>
                                            {course.studentsEnrolled.length} Students
                                        </p>
                                        <p className='text-xs font-medium text-richblack-50'>
                                            |
                                        </p>
                                        <p className='text-xs font-medium text-richblack-300'> Rs {course.price} </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        ):(
            <div className='mt-20 rounded-md bg-richblack-800 p-6 py-20'>
                <p className='text-center text-2xl font-bold text-richblack-5'>
                    You have not Created any courses Yet
                </p>
                <Link to="/dashboard/add-course">
                    <p className='mt-1 text-center text-lg font-semibold text-yellow-50'>
                        Create a Course
                    </p>
                </Link>
            </div>
        )}
    </div>
  )
}

export default Instructor