import React, { useEffect, useState, useRef } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import { getAboutUser } from "@/config/redux/action/authAction";

function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = authState.profileFetched;
  const userName = authState.user?.userId?.name;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, [dispatch, authState.profileFetched]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push("/");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <nav className={styles.navBar}>
        <div className={styles.logoContainer} onClick={() => router.push("/")}>
         <img className={styles.linkedinLogo} src="/images/linkedin.png" alt="" />
          <h1 className={styles.logoText}>JobNexus</h1>
        </div>

        <div className={styles.navBarOptionContainer}>
          {isLoggedIn ? (
            <div className={styles.authLinks}>
              <div
                className={styles.profileLink}
                onClick={() => router.push("/profile")}
              >
                <div className={styles.profileCircle}>
                  {userName && userName.charAt(0).toUpperCase()}
                </div>
                <span>Profile</span>
              </div>
              <div className={styles.logoutButton} onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={styles.logoutIcon}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                <span>Sign Out</span>
              </div>

              <div
                className={styles.mobileProfileIcon}
                onClick={toggleDropdown}
              >
                <div className={styles.profileCircle}>
                  {userName && userName.charAt(0).toUpperCase()}
                </div>
              </div>

              <div
                className={`${styles.profileDropdown} ${
                  showDropdown ? styles.show : ""
                }`}
              >
                <div
                  className={styles.profileDropdownOption}
                  onClick={() => {
                    router.push("/profile");
                    setShowDropdown(false);
                  }}
                >
                  Profile
                </div>
                <div
                  className={styles.profileDropdownOption}
                  onClick={handleLogout}
                >
                  Sign Out
                </div>
              </div>
            </div>
          ) : (
            router.pathname !== "/login" && (
              <div className={styles.authButtons}>
                <div
                  onClick={() => router.push("/login")}
                  className={styles.joinButton}
                >
                  <span>Sign in</span>
                </div>
              </div>
            )
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
