import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../SeeMandates/seeNewMandate.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LinkedInSignIn, getUserProfile } from "src/action/signIn";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "react-toastify";

const LinkedIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useAuth();
  // const storedUserDetails = localStorage.getItem("userDetails");
  // const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  // const startupId = userDetails?.startupId;
  // console.log("status code in linkdin file in top ", userDetails?.status);

  const [loginResponse, setLoginResponse] = useState("");

  useEffect(() => {
    // Extract the code and state from the query parameters

    const url = "localhost:3000/" + router?.asPath;

    const parsedUrl = new URL(url);
    const code = parsedUrl.searchParams.get("code");

    // const state = parsedUrl.searchParams.get("state");
    // dispatch(LinkedInSignIn(code))
    //   .then((res) => {
    //     if (res?.role === "ENTREPRENEUR" && res !== code) {
    //       auth?.signIn();
    //       setLoginResponse(res);
    //       dispatch(getUserProfile(res?.startupId)).then((response) => {
    //         console.log("from response in linkdin file", response?.isProfileUpdated);
    //         console.log("in usestate status in linkdin file", loginResponse?.status);
    //         console.log("user details in localStorage in linkdin file", userDetails?.status);

    //         if (response?.isProfileUpdated === 1 && userDetails?.status === 1) {
    //           router.replace("/SeeMandates");
    //         } else if (response?.isProfileUpdated === 0 && userDetails?.status === 3) {
    //           localStorage.setItem("isProfileUpdated", JSON.stringify({ isProfileUpdated: 0 }));
    //           router.replace("/Profile");
    //         } else if (response?.isProfileUpdated === 1 && userDetails?.status === 3) {
    //           localStorage.setItem("isProfileUpdated", JSON.stringify({ isProfileUpdated: 1 }));
    //           router.replace("/Profile");
    //         }
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    dispatch(LinkedInSignIn(code))
      .then(res => {
        if (res?.role === "ENTREPRENEUR") {
          auth?.signIn();
          setLoginResponse(res);
          return dispatch(getUserProfile(res?.startupId)); // Return this promise
        }
        return null; // Handle cases where the role is not "ENTREPRENEUR"
      })
      .then(response => {
        if (!response) return; // If no response, exit early
        const storedUserDetails = localStorage.getItem("userDetails");
        const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
        console.log("from response in linkdin file", response?.isProfileUpdated);
        console.log("in usestate status in linkdin file", loginResponse?.status);
        console.log("user details in localStorage in linkdin file", userDetails?.status);

        if (response?.isProfileUpdated === 1 && userDetails?.status === 1) {
          router.replace("/SeeMandates");
        } else if (response?.isProfileUpdated === 0 && userDetails?.status === 3) {
          localStorage.setItem("isProfileUpdated", JSON.stringify({ isProfileUpdated: 0 }));
          router.replace("/Profile");
        } else if (response?.isProfileUpdated === 1 && userDetails?.status === 3) {
          localStorage.setItem("isProfileUpdated", JSON.stringify({ isProfileUpdated: 1 }));
          router.replace("/Profile");
        } else if (response?.isProfileUpdated === 0 && userDetails?.status === 4) {
          localStorage.setItem("isProfileUpdated", JSON.stringify({ isProfileUpdated: 0 }));
          router.replace("/Profile");
        } else if (userDetails?.status === 2) {
          toast.error("Sorry! Your profile is rejected", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      })
      .catch(error => {
        console.error("Error during LinkedIn sign in or user profile fetch", error);
      });
  }, []);
  return (
    <>
      <Box className={styles.spinner}>
        <CircularProgress color="secondary" />
      </Box>
    </>
  );
};

export default LinkedIn;
