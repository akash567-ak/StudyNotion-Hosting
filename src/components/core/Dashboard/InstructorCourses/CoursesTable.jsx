import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { COURSE_STATUS } from '../../../../utils/constants';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { deleteCourse, fetchInstructorCourses } from '../../../../Services/operations/courseDetailsAPI';
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useNavigate } from 'react-router-dom';
import formatDate from "../../../../Services/formatDate"
import { HiClock } from "react-icons/hi";
import {FaCheck} from "react-icons/fa"
import {FiEdit} from "react-icons/fi"
import {MdDelete} from "react-icons/md"

export default function CoursesTable({courses, setCourses}) {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const [ loading, setLoading ] = useState(false);
    const [ confirmationModal, setConfirmationModal ] = useState(null);
    const navigate = useNavigate();
    const TRUNCATE_LENGTH = 30


    const handleCourseDelete = async (courseId) => {
        setLoading(true)

        await deleteCourse({courseId:courseId}, token);
        const result = await fetchInstructorCourses(token);
        console.log("PRINTING INS COURSES: ", result)
        if(result) {
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    }
  return (
    <div>
        <Table className='rounded-x1 border border-richblack-800 '>
            <Thead>
                <Tr
                    className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2"
                >
                    <Th className='flex-1 text-left text-sm font-medium uppercase text-richblack-100'>
                        Courses
                    </Th>
                    <Th className='text-left text-sm font-medium upperacse text-richblack-100'>
                        Duration
                    </Th>
                    <Th className='text-left text-sm font-medium upperacse text-richblack-100'>
                        Price
                    </Th>
                    <Th className='text-left text-sm font-medium upperacse text-richblack-100'>
                        Actions
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                {
                    courses.length === 0 ? (
                        <Tr>
                            <Td className='py-10 text-center text-2xl font-medium text-richblack-100'>
                                No Courses Found
                            </Td>
                        </Tr>
                    )
                    : (
                        courses.map((course) => (
                            <Tr
                                key={course._id}
                                className="flex gap-x-10 border-richblack-800 px-6 py-8"
                                >
                                    <Td className="flex flex-1 gap-x-4">
                                        <img
                                            src={course?.thumbnail}
                                            className='h-[148px] w-[220px] rounded-lg object-cover' alt=''
                                        />
                                        <div className='flex flex-col justify-between'>
                                            <p className='text-lg font-semibold text-richblack-5'>
                                                {course.courseName}
                                            </p>
                                            <p className='text-xs text-richblack-300'>
                                                {course.courseDescription.split(" ").length > 
                                                TRUNCATE_LENGTH ?
                                                 course.courseDescription
                                                    .split(" ")
                                                    .slice(0, TRUNCATE_LENGTH)
                                                    .join(" ") + "..." 
                                                : course.courseDescription}
                                            </p>
                                            <p className='text-[12px] text-white'>
                                                Created: {formatDate(course.createdAt)} 
                                            </p>
                                            {
                                                course.status === COURSE_STATUS.DRAFT ? (
                                                    <p className='flex w-fit flex-row items-center gap-3 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100'>
                                                        <HiClock size={14} />
                                                        Drafted
                                                    </p>
                                                ) : (
                                                    <p className='text-yellow-50'>
                                                        <FaCheck size={8} />
                                                        Published
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </Td>
                                    <Td className='text-sm font-medium text-richblack-100'>
                                        2hr 30min
                                    </Td>
                                    <Td className='text-sm font-medium text-richblack-100'>
                                        ₹{course.price}
                                    </Td>
                                    <Td className='text-sm font-medium text-richblack-100'>
                                        <button
                                            disabled={loading}
                                            onClick={() => {
                                                navigate(`/dashboard/edit-course/${course._id}`)
                                            }}
                                            title='Edit'
                                            className='px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300'
                                        >
                                            <FiEdit size={20} />
                                        </button>

                                        <button
                                            disabled={loading}
                                            onClick={() => {
                                                setConfirmationModal({
                                                    text1: "Do you want to delete the course?",
                                                    text2: "All the data related to this course will be deleted",
                                                    btn1Text: !loading ? "Delete" : "Loading...",
                                                    btn2Text: "Cancel",
                                                    btn1Handler:!loading ? () => handleCourseDelete(course._id) : () => {},
                                                    btn2Handler:!loading ? () => setConfirmationModal(null) : () => {},
                                                })
                                            }}
                                            title='Delete'
                                            className='px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]'
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </Td>
                            </Tr>
                        )
                    ))
                }
            </Tbody>
        </Table>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal} 
        />}
    </div>
  )
}
