import { useEffect, useState } from 'react';

// API
import SummaryApi from '../common/index';

// Icons 
import { MdModeEdit } from "react-icons/md";

// toastify
import { toast } from 'react-toastify';
import moment from 'moment';

// Components
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
  const [allUser, setAllUser] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    userId: '', 
    name: '', 
    email: '', 
    role: ''
  });

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method, 
        credentials: 'include', 
        cache: 'no-store'
      });

      const datas = await response.json();

      if (datas.success) {
        setAllUser(datas.data);
      } else {
        toast.error(datas.message || 'Failed to fetch users');
      }

      // console.log('datas', datas);

    } catch (err) {
      console.error('Something went wrong. Please try again.', err);
    }
  }
  
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className='bg-white py-2 px-4'>
      <table className='w-full user-table'>
        <thead>
          <tr className='bg-black text-white pb-3'>
            <th>Sr.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {allUser.map((el, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{el?.name}</td>
              <td>{el?.email}</td>
              <td>{el?.role}</td>
              <td>{moment(el?.createdAt).format('lll')}</td>
              <td>
                <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                  onClick={() => {
                    setUpdateUserDetails(el) 
                    setOpenUpdateRole((prev) => !prev)
                  }}
                >
                  <MdModeEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openUpdateRole && (
        <ChangeUserRole 
          onClose={() => setOpenUpdateRole((prev) => !prev)}
          userId={updateUserDetails._id}
          name={updateUserDetails.name} 
          email={updateUserDetails.email} 
          role={updateUserDetails.role}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  )
}

export default AllUsers;