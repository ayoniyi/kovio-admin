import { Link } from "react-router-dom";
import style from "./NotFound.module.scss";
import { Button } from "@/components/ui/button";
// import Logo from "../../assets/logo.svg";
// import { Button } from "@mui/material";
const NotFound = () => {
  return (
    <>
      <div className={style.container}>
        {/* <img src={Logo} alt="logo" /> */}
        <div className={style.content}>
          <h1 style={{color:"#1a1a1acd"}}>404</h1>
          <p className="text-[#1A1A1A] text-normal tracking-wide ml-1 font-inter mb-5 opacity-60 text-center">Sorry, the page you're looking for doesn't exist.</p>
          <Link to="/">
            {/* <Button variant="contained">Go Home</Button> */}
       <Button 
       //className="w-full h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50 mt-8"
       className="cursor-pointer w-sm h-12 font-interTightText bg-kv-primary hover:bg-kv-primary/90 text-white rounded-full transition-all duration-200 disabled:opacity-50"
        aria-label="Login"
       
       >
        
        Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
