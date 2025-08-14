import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const currentUserId = authState.user?.userId?._id;

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

 useEffect(() => {
  if (authState.all_users.length > 0) {
    const filtered = authState.all_users.filter((user) => {
      const name = user.userId?.name?.toLowerCase() || "";
      const username = user.userId?.username?.toLowerCase() || "";
      const id = user.userId?._id;

      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        username.includes(searchQuery.toLowerCase());

      return id && id !== currentUserId && matchesSearch;
    });

    setFilteredUsers(filtered);
  }
}, [searchQuery, authState.all_users, currentUserId]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.discoverContainer}>
          <h1>Discover People</h1>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.searchIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {searchQuery && (
            <p className={styles.resultsCount}>
              Found {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "result" : "results"}
            </p>
          )}

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    src={user.userId.profilePicture}
                    alt="profile"
                    className={styles.profileImage}
                  />
                  <div className={styles.userInfo}>
                    <h2>{user.userId.name}</h2>
                    <p>@{user.userId.username}</p>
                  </div>
                </div>
              ))
            ) : authState.all_profiles_fetched ? (
              <p className={styles.noResults}>
                {searchQuery
                  ? "No users match your search"
                  : "No other users found"}
              </p>
            ) : (
              <p>Loading users...</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
