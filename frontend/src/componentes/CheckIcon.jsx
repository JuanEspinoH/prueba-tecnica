import React from 'react'

const CheckIcon = ({
  color = 'white',
  bg = 'bg-green-500 ',
  size = 'size-6',
}) => {
  const styleButton = `${color} ${bg} ${size} `
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={styleButton}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  )
}

export default CheckIcon
