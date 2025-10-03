import React, { useContext, useState } from "react";
import { authStyles as styles } from "../assets/dummystyle";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { validateEmail } from "../utils/helper";
import axiosInstances from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { Input } from "./SignupForm";
const SignUp = ({ currentpPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please Enter Fullname");
      return;
    }
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
      const response = await axiosInstances.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
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
        error.response?.data?.message ||
          " Something Went Wrong. Please Try Again"
      );
    }
  };
  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join Thousands of professionals today{" "}
        </p>
      </div>
      {/* Form */}
      <form
        action="submit"
        onSubmit={handleSignUp}
        className={styles.signupForm}
      >
        <Input
          id="fullname"
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="Rohit Sharma"
          type="text"
        />
        <Input
          id="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="rohitsharma@gmail.com "
          type="email"
        />
        <Input
          id="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Minimum 8 Characters "
          type="password"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button className={styles.signupSubmit} type="submit">
          Create Account
        </button>
        {/* Footer */}
        <p className={styles.switchText}>
          Already Have an Account? {""}
          <button
            className={styles.signupSwitchButton}
            type="button"
            onClick={() => currentpPage("login")}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
