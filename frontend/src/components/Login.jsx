import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstances from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { UserContext } from "../context/UserContext";
import { authStyles as styles } from "../assets/dummystyle";
import { Input } from "./SignupForm";

const Login = ({currentpPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
//   const [CurrentPage, setCurrentPage] = useState('login')
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please Enter Valid Email");
      return;
    }
    if (!password) {
      setError("please Enter Password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstances.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Something Went Wrong Please Try Again"
      );
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>Sign In to continue amazing resumes</p>
      </div>
      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="rohitsharma@gmail.com"
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Minimum 8 Characters"
          type="password"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button className={styles.submitButton} type="submit"> Sign In</button>
        <p className={styles.switchText}>Don't have an Account?{' '}
            <button className={styles.switchButton} type="button" onClick={()=>currentpPage('signup')}>Sign Up</button>
        </p>
      </form>
    </div>
  );
};

export default Login;
