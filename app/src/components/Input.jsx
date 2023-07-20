import { forwardRef, useEffect } from "react";

export const Input = forwardRef((_, ref) => {
  useEffect(() => {
    ref.current.focus();
  }, [])

  return (
    <input type='text' ref={ref} className=" fs-3 " />
  )
})