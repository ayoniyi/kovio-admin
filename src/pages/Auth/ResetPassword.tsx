import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "../../assets/main/logo.svg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { publicRequest } from "@/utils/requestMethods";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userInput, setUserInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get code from URL query parameter
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setCode(codeParam);
    }
  }, [searchParams]);

  console.log("CODE::: ", code);

  const inputHandler = (event: any) => {
    const value = event.target.value;
    setUserInput({
      ...userInput,
      [event.target.name]: value,
    });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (userInput.password !== userInput.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please enter the same password",
        variant: "destructive",
      });
      return;
    }
    if (userInput.password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long",
        description:
          "Please enter a password that is at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // Check if password contains both letters and numbers
    const hasLetter = /[a-zA-Z]/.test(userInput.password);
    const hasNumber = /\d/.test(userInput.password);

    if (!hasLetter || !hasNumber) {
      toast({
        title: "Password must contain both letters and numbers",
        description:
          "Please enter a password that includes both letters and numbers",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const endpoint = `/users/verification/change-password`;
      const response = await publicRequest.post(endpoint, {
        uniqueVerificationCode: code,
        newPassword: userInput.password,
      });
      console.log("RESPONSE::: ", response);
      toast({
        title: "Success",
        description: "Password reset successfully",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create password",
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
          {/* <span className="text-xl text-[#1A1A1A] font-sans">
            KOVIO <span className="font-bold">Admin</span>
          </span> */}
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6 font-sans">
          Reset Password
        </h1>

        <div className="w-full max-w-[400px] flex flex-col items-center">
          <p className="text-[#1A1A1A] text-normal  tracking-wide ml-1 font-inter mb-5 opacity-60 ">
            Enter your new password.
          </p>
        </div>

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-[#888888] text-normal capitalize tracking-wide ml-1 "
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="****"
                className="rounded-full h-12 bg-white border-gray-200 pr-12 focus:ring-[#FF4E00] focus:border-[#FF4E00] mt-2"
                value={userInput.password}
                onChange={inputHandler}
                name="password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-[#888888] text-normal capitalize tracking-wide ml-1"
            >
              Retype New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="****"
                className="rounded-full h-12 bg-white border-gray-200 pr-12 focus:ring-[#FF4E00] focus:border-[#FF4E00] mt-2"
                value={userInput.confirmPassword}
                onChange={inputHandler}
                name="confirmPassword"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
