import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "../../assets/main/logo.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { publicRequest } from "@/utils/requestMethods";
import { Loader2 } from "lucide-react";

const EnterCode = () => {
  const navigate = useNavigate();
  // Changed to 6 digits
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Get code from URL query parameter
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all filled
    if (newOtp.every((d) => d !== "") && index === 5 && value !== "") {
      // Optional: trigger verify automatically
      // handleVerify()
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = `/users/user/verify-signup-or-login-code`;
      const res: any = await publicRequest.post(endpoint, {
        email: email,
        uniqueVerificationCode: otp.join(""),
      });
      console.log("res", res);
      navigate(`/reset-password?code=${otp.join("")}`);
      toast({
        title: "Success",
        description: "Code verified successfully",
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

    //navigate("/reset-password");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8F9FA] px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div>
            <img src={Logo} alt="Kovio Logo" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6 font-sans">
          Email Verification
        </h1>

        <div className="w-full max-w-[400px] flex flex-col items-center">
          <p className="text-[#1A1A1A] text-normal tracking-wide ml-1 font-inter mb-5 opacity-60 text-center">
            Enter the code sent to your email
          </p>
        </div>

        <form onSubmit={handleVerify} className="w-full space-y-6">
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="lg:w-[64px] lg:h-[64px] w-[48px] h-[48px] text-center text-xl font-bold rounded-[8px] border border-gray-200 focus:border-[#FF4E00] focus:ring-1 focus:ring-[#FF4E00] outline-none transition-all bg-white text-[#1A1A1A]"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="cursor-pointer w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50 mt-8"
            aria-label="Verify Code"
            disabled={otp.some((d) => !d) || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Submit Code"
            )}
          </Button>

          <div className="mt-4">
            <p className="text-normal text-[#888888] font-inter">
              Didn't receive a code?{" "}
              <button
                type="button"
                className="text-[#FF4E00] font-semibold hover:underline cursor-pointer"
              >
                Resend
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EnterCode;
