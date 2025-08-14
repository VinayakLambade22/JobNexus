import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { clientServer } from "@/config";
import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [originalProfile, setOriginalProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showAddWork, setShowAddWork] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      setOriginalProfile(authState.user);
      const posts = postReducer.posts.filter(
        (post) => post.userId.username === authState.user.userId.username
      );
      setUserPosts(posts);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    setOriginalProfile({ ...userProfile });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const isChanged = () => {
    if (!originalProfile || !userProfile) return false;
    return (
      userProfile.userId?.name !== originalProfile.userId?.name ||
      userProfile.bio !== originalProfile.bio ||
      userProfile.currentPost !== originalProfile.currentPost ||
      JSON.stringify(userProfile.pastWork) !==
        JSON.stringify(originalProfile.pastWork) ||
      JSON.stringify(userProfile.education) !==
        JSON.stringify(originalProfile.education)
    );
  };

  const AddWorkComponent = () => {
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [years, setYears] = useState("");

    const handleSave = () => {
      if (company && position && years) {
        const updatedWork = [
          ...userProfile.pastWork,
          { company, position, years },
        ];
        setUserProfile({ ...userProfile, pastWork: updatedWork });
        setShowAddWork(false);
      }
    };

    return (
      <div className={styles.inputCard}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <input
          placeholder="Years (e.g., 2023–2024)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <button onClick={handleSave}>Save Work</button>
      </div>
    );
  };

  const AddEducationComponent = () => {
    const [school, setSchool] = useState("");
    const [degree, setDegree] = useState("");
    const [years, setYears] = useState("");

    const handleSave = () => {
      if (school && degree && years) {
        const updatedEdu = [
          ...userProfile.education,
          { school, degree, years },
        ];
        setUserProfile({ ...userProfile, education: updatedEdu });
        setShowAddEducation(false);
      }
    };

    return (
      <div className={styles.inputCard}>
        <input
          placeholder="School / University"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />
        <input
          placeholder="Degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
        />
        <input
          placeholder="Years (e.g., 2021–2024)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <button onClick={handleSave}>Save Education</button>
      </div>
    );
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backdropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backdrop_overlay}
              >
                <img
                  className={styles.backDrop}
                  src={userProfile.userId.profilePicture}
                  alt="Profile"
                />
                <input
                  onChange={(e) => updateProfilePicture(e.target.files[0])}
                  type="file"
                  id="profilePictureUpload"
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div>
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                    <p style={{ color: "gray" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div className={styles.bioContainer}>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ flex: "0.3" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? (
                            <img src={post.media} alt="Post media" />
                          ) : (
                            <div
                              style={{ width: "auto", height: "4rem" }}
                            ></div>
                          )}
                        </div>
                        <p className={styles.card_text}>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold" }}>
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                ))}
                {showAddWork && <AddWorkComponent />}
                <button
                  onClick={() => setShowAddWork((prev) => !prev)}
                  className={styles.addWorkButton}
                >
                  {showAddWork ? "Close" : "Add Work"}
                </button>
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Education</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.education.map((edu, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p style={{ fontWeight: "bold" }}>
                      {edu.school} - {edu.degree}
                    </p>
                    <p>{edu.years}</p>
                  </div>
                ))}
                {showAddEducation && <AddEducationComponent />}
                <button
                  onClick={() => setShowAddEducation((prev) => !prev)}
                  className={styles.addWorkButton}
                >
                  {showAddEducation ? "Close" : "Add Education"}
                </button>
              </div>
            </div>

            {isChanged() && (
              <div
                onClick={updateProfileData}
                className={styles.editProfileButton}
              >
                Save Changes
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
