import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "../../assets/main/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { publicRequest } from "@/utils/requestMethods";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    email: "",
  });
  const inputHandler = (event: any) => {
    const value = event.target.value;
    setUserInput({
      ...userInput,
      [event.target.name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const endpoint = `users/admin/verification/initiate-forgot-password-flow/${userInput.email}`;
      const res: any = await publicRequest.post(endpoint, {
        email: userInput.email,
      });
      console.log("res", res);
      navigate(`/enter-code?email=${userInput.email}`);
      toast({
        title: "Success",
        description: "Code sent to your email",
      });
    } catch (e: any) {
      toast({
        title: "Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div>
            <img src={Logo} alt="Kovio Logo" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6 font-sans">
          Forgot Password
        </h1>

        <div className="w-full max-w-[400px] flex flex-col items-center">
          <p className="text-[#1A1A1A] text-normal tracking-wide ml-1 font-inter mb-5 opacity-60">
            Enter your registered email address and we'll send a code to reset
            your password
          </p>
        </div>

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-[#888888] text-normal capitalize tracking-wide ml-1 "
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address..."
              className="rounded-full h-12 bg-white border-gray-200 focus:ring-[#FF4E00] focus:border-[#FF4E00] mt-2"
              value={userInput.email}
              onChange={inputHandler}
              name="email"
              required
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            //className="cursor-pointer w-full h-12 rounded-full bg-[#FF4E00] hover:bg-[#E04500] text-white font-bold text-base mt-2"
            className="cursor-pointer w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Send Code"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send Code"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
