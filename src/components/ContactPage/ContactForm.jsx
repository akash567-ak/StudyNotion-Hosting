import React from 'react'
import ContactUsForm from './ContactUsForm'

const ContactForm = () => {
  return (
    <div className=' flex flex-col border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 gap-3 '>
        <h1 className='text-4xl leading-10 font-semibold text-richblack-5'>
            Got a Idea? We've got the skills. Let's team up
        </h1>
        <p>
            Tell us about more about yourself and what you're got in mind.
        </p>

        <div className='flex lg:flex-col mt-7'>
            <ContactUsForm />
        </div>
    </div>
  )
}

export default ContactForm