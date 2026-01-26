import React from 'react'
import HighlightText from '../HomePage/HighlightText'
const Quote = () => {
  return (
    <div>
        We are passionate about revolutionizing the way we learn,
        innovation platform
        <HighlightText text={"Combines technology"}/>
        <span className='text-yellow-300'>
            {" "}
        </span>
        , and community to Create an
        <span className='text-brown-300'>
            {" "}
            unparalled educational experience.
        </span>
    </div>
  )
}

export default Quote