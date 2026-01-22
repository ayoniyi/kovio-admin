import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "../../assets/main/logo.svg";
import Success from "../../assets/icons/success.svg";

const ResetSuccessful = () => {
   
    // Changed to 5 digits based on common OTP patterns and "quite different" feedback
   
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
            <div className="w-full max-w-[400px] flex flex-col items-center">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-8">
                     <div><img src={Logo} alt="Kovio Logo" /></div>
                </div>


<div className="flex items-center gap-3 mb-8">
                     <div><img src={Success} alt="Success" className="w-[85px]" /></div>
                </div>
                {/* Heading */}
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6 font-sans">Password Reset Successful</h1>

                <div className="w-full max-w-[400px] flex flex-col items-center">
                    <p className="text-[#1A1A1A] text-normal tracking-wide ml-1 font-inter mb-5 opacity-60 text-center">
                        You have successfully changed your password. 
                    </p>
                </div>

                <form className="w-full space-y-6">
                    

                   

                    <Button
                        type="submit"
                        className="cursor-pointer w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50 mt-8"
                        aria-label="Verify Code"
                        
                    >
                   Proceed to Login
                    </Button>

                    
                 
                </form>
            </div>
        </div>
    );
};
export default ResetSuccessful;
