import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  acceptConnectionRequest,
  getMyConnectionRequests,
  getMyNetwork,
  rejectConnectionRequest,
  disconnectConnection, 
} from "@/config/redux/action/authAction";
import styles from "./style.module.css";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    dispatch(getMyNetwork({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h1>My Connections</h1>
          {authState.connectionRequest.length === 0 ? (
            <p>No connection requests.</p>
          ) : (
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user) => (
                <div
                  className={styles.userCard}
                  key={user._id}
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.userInfoContainer}>
                    <div className={styles.profilePicture}>
                      <img
                        src={user.userId.profilePicture}
                        alt={user.userId.name}
                      />
                    </div>
                    <div className={styles.userDetails}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            acceptConnectionRequest({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })
                          );
                        }}
                        className={styles.acceptButton}
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            rejectConnectionRequest({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                            })
                          );
                        }}
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}

          <h4>My Network</h4>
          {authState.network.length === 0 ? (
            <p>No connections yet.</p>
          ) : (
            authState.network.map((user) => (
              <div
                className={styles.userCard}
                key={user._id}
                onClick={() => router.push(`/view_profile/${user.username}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.userInfoContainer}>
                  <div className={styles.profilePicture}>
                    <img src={user.profilePicture} alt={user.name} />
                  </div>
                  <div className={styles.userDetails}>
                    <h3>{user.name}</h3>
                    <p>{user.username}</p>
                  </div>
                  <div
                    style={{ marginLeft: "auto" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={styles.rejectButton}
                      onClick={() =>
                        dispatch(
                          disconnectConnection({
                            connectionId: user._id,
                            token: localStorage.getItem("token"),
                          })
                        )
                      }
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
