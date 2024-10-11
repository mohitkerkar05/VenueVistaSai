import { NavLink } from 'react-router-dom';


import'./Add_Venue.css';
import Sidebar from '../Venue Manager Sidebar/VeSideBar';

const Add_Venue = () => {
    return (
        <>
        <Sidebar></Sidebar>
    <div>
      <h1>Add Venue</h1>
      {/* Your component content goes here */}
    </div>
    </>
  );
};

export default Add_Venue; // Ensure this line is present
