import { useState } from 'react';

import ROLE from '../common/role';

// Icons 
import { IoMdClose } from "react-icons/io";

// API
import SummaryApi from '../common';

// toastify
import { toast } from 'react-toastify';

const ChangeUserRole = ({ userId, name, email, role, onClose, callFunc }) => {
  const [userRole, setUserRole] = useState(role);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);

    console.log('select', e.target.value);
  }

  const updateUserRole = async () => {
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method, 
        credentials: 'include', 
        cache: 'no-store', 
        headers: {
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ userId: userId, role: userRole })
      })

      const data = await response.json();
      // console.log('user role', data);
      if (data.success) {
        toast.success(data.message);
        onClose();
        callFunc();
      }

    } catch (err) {
      console.error('Something went wrong. Please try again.', err);
    }
  }

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-slate-200 bg-opacity-50">
      <div className="mx-auto bg-white shadow-md p-4 max-w-sm w-full">
        
        <button className='block ml-auto text-lg'
          onClick={onClose}
        >
          <IoMdClose />
        </button>
        
        <h1 className="pb-4 text-lg font-medium">
          Change User Role
        </h1>
        <p>Name: {name}</p>
        <p className='mb-4'>Email: {email}</p>

        <label htmlFor="role">Role:</label>
        <select name='role' id='role' value={userRole} 
          onChange={handleOnChangeSelect}
          className='mx-4 border px-4 py-1 cursor-pointer'
        >
          {Object.values(ROLE).map((el) => {
            return (
              <option value={el} key={el}>
                {el}
              </option>
            )
          })}
        </select>

        <button className='w-fit mx-auto block py-1 px-3 rounded-full bg-red-600 text-white hover:bg-red-700 mt-4'
          onClick={updateUserRole}
        >
          Change Role
        </button>
      </div>
    </section>
  )
}

export default ChangeUserRole;