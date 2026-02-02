"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Signup(){
    const [ postInputs, setPostInputs ] = useState({
        name:"",
        phone:"",
        password:""
    });

    return<div className="h-screen flex flex-col justify-center items-center">
      <div className="">
        <div className="text-3xl mb-6 px-6 font-extrabold">
          Create Account
        </div>
        {/* <div className="text-slate-400 text-center mb-4 px-6">
          {"Already have an account? "}
        </div> */}
        <InputBox label="Name" placeholder="Enter Name" onChange={(e)=>{
          setPostInputs({
            ...postInputs,
            name: e.target.value,
          })
        }} /> 
        <InputBox label="Phone" placeholder="Enter Phone" onChange={(e)=>{
          setPostInputs({
            ...postInputs,
            phone: e.target.value,
          })
        }} />
        <InputBox type="password" label="Password"  placeholder="Enter Password" onChange={(e)=>{
          setPostInputs({
            ...postInputs,
            password: e.target.value,
          })
        }} />
        <button onClick={async ()=>{
            await signIn("credentials", {
              ...postInputs,
              mode: "signup",             
              callbackUrl: "/dashboard",    //Let NextAuth redirect
            });
          }}  className="mt-5 w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
          {"Signin"}
        </button>
        <button className="mt-5 w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          onClick={()=>{
          signIn("google", {
            callbackUrl: "/dashboard",})
          }}>Signin with Google</button>
    </div>
    </div>
}
type labelledInput={
  label: string;
  placeholder: string;
  onChange: (e: any)=>void;
  type?: string
}
function InputBox({label, placeholder, onChange, type = "text"}:labelledInput){
  return <div>
    <label htmlFor="first_name" className="block mb-1 mt-1 text-md font-medium text-black-900 ">{label}</label>
    <input type={type} onChange={onChange} id="first_name" className=" border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
  </div>
}