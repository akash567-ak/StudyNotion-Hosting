import { useEffect } from 'react'

//This hook detects clicks outside of the specified comment and calls the provided handler function
export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    //Define the listner function to be called on click/touch event
    const listner = (event) => {
        if(!ref.current || ref.current.contains(event.target)) {
            return;
        }
        //otherwise, call the provided handler function
        handler(event);
    };
    //Add event listner for mousedown and touchstart
    document.addEventListener("mousedown", listner);
    document.addEventListener("touchstart", listner);

    //Cleanup function to remove the event listner when the component unmounts or when the ref/handler dependencies change
    return () => {
        document.removeEventListener("mousedown" , listner);
        document.removeEventListener("touchstart" , listner);
        }
    }, [ref, handler]); //only runs this ref when the ref and handler function changes
}

