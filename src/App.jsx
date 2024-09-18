import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Initial_page from './1-Initial Page/Initial_page'
import User_Booking_History from './3-User Booking History/User_Booking_History'
import User_Home_Page from './2-User Home Page/User_Home_Page'
import User_Personal_Details from './4-User Personal Details/User_Personal_Details'
import User_Review from './5-User Review/User_Review'

function App() {

  return (
    <>
      {/* <Initial_page/> */}

      {/* <User_Booking_History/> */}

      {/* <User_Home_Page/>*/}

      {/* <User_Personal_Details/> */}

      {/* <User_Review></User_Review> */}

      <Router>
      {/* Routes for navigation */}
      <Routes>
        {/* Default route to render Initial_page when visiting '/' */}
        <Route path="/" element={<User_Home_Page />} />


        {/* Other routes */}
        <Route path="/home" element={<User_Home_Page />} />
        <Route path="/booking-history" element={<User_Booking_History />} />
        <Route path="/my-details" element={<User_Personal_Details />} />
        <Route path="/leave-review" element={<User_Review />} />


        {/* Redirect any unknown routes to the initial page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
