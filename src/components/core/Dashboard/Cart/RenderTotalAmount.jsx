import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn';
import { buyCourse } from '../../../../Services/operations/studentFeaturesAPI';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const RenderTotalAmount = () => {

    const {total, cart} = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these course:", courses);
        buyCourse(token, courses, user, navigate, dispatch)
    }

  return (
    <div className='min-h-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        <p className='mb-1 text-3xl font-medium text-richblack-300'>Total:</p>
        <p className='mb-6 text-3xl font-medium text-yellow-100'>Rs {total}</p>

        <IconBtn 
            text="Buy Now"
            onClick={handleBuyCourse}
            customClasses="w-full justify-center"
        />

    </div>
  )
}

export default RenderTotalAmount