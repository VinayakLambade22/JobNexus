import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(true);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn && userLoginMethod) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, userLoginMethod, router]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  useEffect(() => {
    if (
      authState.message?.message ===
      "Registration successfull ! Please Sign In."
    ) {
      setUsername("");
      setEmailAddress("");
      setPassword("");
      setName("");
    }
  }, [authState.message]);

  const handleRegister = () => {
    dispatch(
      registerUser({
        username,
        email,
        password,
        name,
      })
    );
  };

  const handleLogin = () => {
    dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            {authState.message && (
              <p style={{ color: "red" }}>
                {typeof authState.message === "object"
                  ? authState.message.message
                  : authState.message}
              </p>
            )}

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}

              <input
                value={email}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              <div
                className={styles.buttonWithOutline}
                onClick={userLoginMethod ? handleLogin : handleRegister}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            <p className={styles.toggleText}>
              {userLoginMethod ? "Don't have an account? " : "Already have an account? "}
              <span
                className={styles.toggleAction}
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
              >
                {userLoginMethod ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
