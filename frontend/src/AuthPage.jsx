import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import meadowBackground from "./assets/Pixel Countryside Cottage Meadow.png";
import seedImage from "./assets/seed.png";
import "./AuthPage.css";
import { useAuth } from "./context/useAuth";

const initialLoginValues = {
  identifier: "",
  password: "",
};

const initialSignUpValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function AuthField({
  autoComplete,
  icon,
  label,
  name,
  onChange,
  type = "text",
  value,
  onTogglePassword,
  passwordVisible = false,
}) {
  const inputType = type === "password" && passwordVisible ? "text" : type;

  return (
    <label className="auth-field">
      <span className="sr-only">{label}</span>
      {icon}
      <input
        autoComplete={autoComplete}
        name={name}
        onChange={onChange}
        placeholder={label}
        type={inputType}
        value={value ?? ""}
      />
      {type === "password" && (
        <button
          aria-label={passwordVisible ? `Hide ${label}` : `Show ${label}`}
          className="password-toggle"
          onClick={onTogglePassword}
          type="button"
        >
          {passwordVisible ? <EyeOff size={21} /> : <Eye size={21} />}
        </button>
      )}
    </label>
  );
}

function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const [values, setValues] = useState(
    isLogin ? initialLoginValues : initialSignUpValues,
  );
  const [errors, setErrors] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors([]);
  };

  const togglePassword = (fieldName) => {
    setVisiblePasswords((currentVisibility) => ({
      ...currentVisibility,
      [fieldName]: !currentVisibility[fieldName],
    }));
  };

  const validate = () => {
    const nextErrors = [];

    if (Object.values(values).some((value) => !value.trim())) {
      nextErrors.push("Please complete all required fields.");
    }

    if (!isLogin && values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.push("Please enter a valid email address.");
    }

    if (
      !isLogin &&
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      nextErrors.push("Passwords must match.");
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await (isLogin ? login(values) : signup(values));
      navigate("/garden");
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="auth-page"
      style={{ backgroundImage: `url("${meadowBackground}")` }}
    >
      <div className={`auth-shell ${isLogin ? "login-shell" : "signup-shell"}`}>
        <nav className="auth-tabs" aria-label="Authentication">
          <Link className={isLogin ? "auth-tab active" : "auth-tab"} to="/login">
            Login
          </Link>
          <Link className={!isLogin ? "auth-tab active" : "auth-tab"} to="/signup">
            Sign Up
          </Link>
        </nav>

        <section className="auth-card" aria-labelledby="auth-heading">
          <div className="auth-card-content">
          <h1 id="auth-heading" className="auth-heading">
            {isLogin ? "Welcome Back!" : "Create Your Garden!"}
            <img src={seedImage} alt="" />
          </h1>

          <form
            className={`auth-form ${isLogin ? "login-form" : "signup-form"}`}
            onSubmit={handleSubmit}
            noValidate
          >
            {isLogin ? (
              <>
                <AuthField
                  autoComplete="username"
                  icon={<UserRound aria-hidden="true" size={22} />}
                  label="Username or Email"
                  name="identifier"
                  onChange={updateValue}
                  value={values.identifier}
                />
                <AuthField
                  autoComplete="current-password"
                  icon={<LockKeyhole aria-hidden="true" size={22} />}
                  label="Password"
                  name="password"
                  onChange={updateValue}
                  onTogglePassword={() => togglePassword("password")}
                  passwordVisible={visiblePasswords.password}
                  type="password"
                  value={values.password}
                />
              </>
            ) : (
              <>
                <AuthField
                  autoComplete="username"
                  icon={<UserRound aria-hidden="true" size={22} />}
                  label="Username"
                  name="username"
                  onChange={updateValue}
                  value={values.username}
                />
                <AuthField
                  autoComplete="email"
                  icon={<Mail aria-hidden="true" size={22} />}
                  label="Email Address"
                  name="email"
                  onChange={updateValue}
                  type="email"
                  value={values.email}
                />
                <AuthField
                  autoComplete="new-password"
                  icon={<LockKeyhole aria-hidden="true" size={22} />}
                  label="Password"
                  name="password"
                  onChange={updateValue}
                  onTogglePassword={() => togglePassword("password")}
                  passwordVisible={visiblePasswords.password}
                  type="password"
                  value={values.password}
                />
                <AuthField
                  autoComplete="new-password"
                  icon={<LockKeyhole aria-hidden="true" size={22} />}
                  label="Confirm Password"
                  name="confirmPassword"
                  onChange={updateValue}
                  onTogglePassword={() => togglePassword("confirmPassword")}
                  passwordVisible={visiblePasswords.confirmPassword}
                  type="password"
                  value={values.confirmPassword}
                />
              </>
            )}

            {errors.length > 0 && (
              <p className="auth-errors" role="alert">
                {errors.map((error) => (
                  <span key={error}>{error}</span>
                ))}
              </p>
            )}

            <button className="auth-submit" disabled={submitting} type="submit">
              {submitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/signup" : "/login"}>
              {isLogin ? "Sign Up" : "Login"}
            </Link>
          </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
