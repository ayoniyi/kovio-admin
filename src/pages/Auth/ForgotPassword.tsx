import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/main/logo.svg"
import { Link } from "react-router-dom";


const ForgotPassword = () => {
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div >
             <img src={Logo} alt="Kovio Logo" />
          </div>
          
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6 font-sans">
         Forgot Password
        </h1>

        <div className="w-full max-w-[400px] flex flex-col items-center">
            <p className="text-[#1A1A1A] text-normal tracking-wide ml-1 font-inter mb-5 opacity-60">Enter your registered email address and we'll send a code to reset your password</p>
        </div>

        {/* Form */}
        <form className="w-full space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#888888] text-normal capitalize tracking-wide ml-1 ">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address..."
              className="rounded-full h-12 bg-white border-gray-200 focus:ring-[#FF4E00] focus:border-[#FF4E00] mt-2"
            />
          </div>

         

          {/* Login Button */}
          <Button
            type="submit"
            //className="cursor-pointer w-full h-12 rounded-full bg-[#FF4E00] hover:bg-[#E04500] text-white font-bold text-base mt-2"
            className="cursor-pointer w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50"
        aria-label="Send Code"
          >
          Send Code
          </Button>
        </form>
      </div>
    </div>
    )
}

export default ForgotPassword