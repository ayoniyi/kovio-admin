import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/main/logo.svg"
import { Link, useNavigate } from "react-router-dom"; 
import { toast } from "@/hooks/use-toast";
import { publicRequest } from "@/utils/requestMethods";
import { AuthContext } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const inputHandler = (event: any) => {
    const value = event.target.value;
    setUserInput({
      ...userInput,
      [event.target.name]: value,
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const [authState, setAuthState] = useContext<any>(AuthContext);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setIsLoading(true);
    if (navigator.onLine) {
      try {
        const newUser = {
          email: userInput.email,
          password: userInput.password,
        };
       
        const endpoint = `auth/admin/user-email-login`;
        const logUserReq = await publicRequest.post(endpoint, newUser);
        setAuthState({
          ...authState,
          user: logUserReq.data.data,
        });
        console.log("REQ RESPONSE::: ", logUserReq.data.data);
       // navigate("/overview");
      } catch (err:any) {
         console.log("ERROR::: ", err);
        // toast({
        //   title: "Error",
        //   description: "Please check your email and password and try again.",
        //   variant: "destructive",
        // });
        const error = err?.response?.data?.message;
       
        if (error === "Account not verified") {
          toast({
            title: "Login failed",
            description: "Please verify your email address",
            variant: "destructive",
          });
        } else if (error === "Invalid credentials") {
          toast({
            title: "Invalid credentials",
            description: "Incorrect email or password",
            variant: "destructive",
          });
         
        } else {
          toast({
            title: "Login failed",
            description:
              err?.response?.data?.message || "Sorry an error occured.",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
      return;
    } else {
      toast({
        title: "No internet connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div >
             <img src={Logo} alt="Kovio Logo" />
          </div>
          {/* <span className="text-xl text-[#1A1A1A] font-sans">
            KOVIO <span className="font-bold">Admin</span>
          </span> */}
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-8 font-sans">
          Welcome back!
        </h1>

        {/* Form */}
        <form className="w-full space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#888888] text-normal capitalize tracking-wide ml-1 ">
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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#888888] text-normal capitalize tracking-wide ml-1">
              Password
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

          {/* Forgot Password Link */}
          <div className="w-full flex justify-end">
            <Link
              to="/forgot-password"
            //   className="text-[#1A1A1A] font-semibold text-sm hover:underline"
               className="text-sm font-interTightText text-kv-primary hover:text-kv-primary/80 transition-colors hover:underline rounded"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            //className="cursor-pointer w-full h-12 rounded-full bg-[#FF4E00] hover:bg-[#E04500] text-white font-bold text-base mt-2"
           className="cursor-pointer w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50"
        aria-label="Login"
        disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;