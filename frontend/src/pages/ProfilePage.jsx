
import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import AppContext from '../context/AppContext';

const ProfilePage = () => {
  const {authUser,updateUserProfileData}=useContext(AppContext);

  const [selectedImg,setSelectedImg]=useState(null);
  const navigate=useNavigate();
  const [name,setName]=useState(authUser.fullName);
  const [bio,setBio]=useState(authUser.bio);




  const handleSubmit=async(event)=>{
    event.preventDefault();

    if(!selectedImg){
      await updateUserProfileData({fullName:name,bio});
      navigate("/");
    }
    const reader=new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload=async()=>{
      const base64Imgae=reader.result;
      await updateUserProfileData({profilePic:base64Imgae,fullName:name,bio})
      navigate("/");
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop:blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse
        rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            upload profile image
          </label>
          <input value={name} onChange={(e)=>setName(e.target.value)} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}>
          </textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage


// 1️⃣ What Base64 is
// Base64 is a way to encode binary data (like images, audio, files) into plain text using only 64 ASCII characters (A–Z, a–z, 0–9, +, /).
// It allows you to embed images directly into HTML, CSS, or JSON without using separate files.
// 2️⃣ How base64Img looks
// A Base64 image is a long string that starts like this:
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
// data:image/png;base64, → tells the browser that this is a PNG image encoded in Base64.
// The rest (iVBORw0KGgoAAAANS...) is the actual image data.
// 3️⃣ Common uses
// Sending images in APIs:
// {
//   "profilePic": "data:image/png;base64,iVBORw0KGgoAAAANS..."
// }
// No need to upload a separate file; the image is sent as text.
// Displaying images in React/HTML:
// <img src={base64Img} alt="profile" />
// The browser decodes Base64 and renders the image.
// Uploading to cloud services:
// Some APIs (like Cloudinary) allow uploading images directly from a Base64 string instead of a file.
// 4️⃣ How to convert an image to Base64 in JavaScript
// const file = input.files[0];
// const reader = new FileReader();
// reader.onloadend = () => {
//   const base64Img = reader.result; // this is the Base64 string
//   console.log(base64Img);
// };
// reader.readAsDataURL(file);