import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
  const { loading} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const captchaRef= useRef();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRecaptcha = (token) => {
    setRecaptchaToken(token);
    console.log("Recaptcha Token:", token);
  };
  // console.log(formData);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError("");

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA challenge.");
      return;
    }

    try {
      dispatch(signInStart());

      const res = await axios.post("/api/auth/signin", {
         ...formData, recaptchaToken
      });

      const data = await res.data;

      console.log("data  ",data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setError(data.message);
        return;
      }
     
      dispatch(signInSuccess(data));
      captchaRef.current.reset();
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-4-xl text-center font-semibold my-7">Sign In</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
          onChange={handleChange}
        ></input>
        
        <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptcha} ref={captchaRef}/>

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}{" "}
        </button>
        <OAuth />
      </form>

      <div className="flex justify-between gap-2 mt-5">
        <p>Dont have an Account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>

        <Link to="/forgot-password" className="text-red-600">
          Forgot Password?
        </Link>
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
