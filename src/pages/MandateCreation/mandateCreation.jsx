import React, { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "../../layouts/dashboard/layout";
import { Typography } from "@mui/material";
import {
  applicationsDetails,
  fetchDomains,
  navigateIncompleteMandate,
} from "src/action/createMandate";
import { useDispatch, useSelector } from "react-redux";
import ExternalContainer from "src/components/ExternalContainer";
import Domain from "./Domain";
import MandateForm from "./createMandateForm";
import Loader from "src/components/Loader";
import { useRouter } from "next/router";
import { investorSubscriptionLimitCheck } from "src/action/globalApi";
import { SWEETALERT } from "src/components/sweetalert2";

const Mandate = () => {
  const headingTag = {
    color: "#129690",
    fontWeight: "700",
    fontSize: "1.2rem",
  };

  const button = {
    // backgroundColor: "#FFFFFF",
    border: "1px solid #8A1538",
    // color: "#8A1538",
  };

  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const userId = userDetails?.id;
  const investorId = userDetails?.investorId;

  //For Domain File
  const dispatch = useDispatch();
  const url = useRouter();
  const [activeDomainId, setActiveDomainId] = useState(null);
  const [activeDomainName, setActiveDomainName] = useState(null);
  const [activeApplicationId, setActiveApplicationId] = useState([]);
  const [activeApplicationName, setActiveApplicationName] = useState([]);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [isNewSelectionMade, setIsNewSelectionMade] = useState(false);
  // const [formVisible, setFormVisible] = useState(false);
  const [otherDomainData, setOtherDomainData] = useState({});

  /**
   * Api call
   */
  useEffect(() => {
    //   To get Domain Name
    dispatch(fetchDomains());
  }, [dispatch]);

  const loading = useSelector((state) => state?.newMandate?.loading);
  const domains = useSelector((state) => state?.newMandate?.domain);
  const applications = useSelector((state) => state?.newMandate?.applications);
  let editMandateData = useSelector((state) => state.newMandate.incompleteMandateData);

  editMandateData = url.query.edit === "true" ? editMandateData : {};

  /**
   * On Reload to get Edit Mandate Data
   */
  useEffect(() => {
    if (url.query.edit === "true") {
      // setFormVisible(true);
      const editMandateId = url.query.id;
      dispatch(navigateIncompleteMandate(investorId, editMandateId)).then((res) => {
        if (res?.spacesAndTech !== null) {
          const [domainName, applicationNames] = Object?.entries(res?.spacesAndTech)[0];
          setActiveDomainName(domainName);

          setActiveApplicationName(
            Array.isArray(applicationNames)
              ? applicationNames
              : applicationNames.split(",").map((name) => name.trim())
          );
        }
        if (editMandateData?.technology?.length === 0) {
          setActiveDomainId(0);
          setActiveDomainName("Others"); // Assuming 'null' represents "Others"
        } else {
          setActiveDomainId(editMandateData?.technology);
        }
        dispatch(applicationsDetails(editMandateData?.technology, investorId));
        const editedapplicationId = editMandateData?.appId?.map(
          (app) => app?.domain_tech_mapping_id
        );
        setActiveApplicationId(editedapplicationId);
      });
    } else {
      setActiveDomainId([]);
    }
  }, []);

  // To render application of the Domain
  const handleApplicationDetail = (domain) => {
    // Reset selected applications if domain changed
    if (activeDomainId !== domain?.id) {
      setActiveApplicationId([]);
      setActiveApplicationName([]);

      // setFormVisible(false);

      setSelectCheckBox(false);
    }
    setActiveDomainId(domain?.id);
    setActiveDomainName(domain?.name);
    setIsNewSelectionMade(true);
    dispatch(applicationsDetails(domain?.id, investorId));
  };

  //To Select the application Detail

  const handleApplicationSelection = (app, isChecked) => {
    setActiveApplicationId((prevIds) =>
      isChecked ? [...prevIds, app?.id] : prevIds.filter((id) => id !== app?.id)
    );

    setActiveApplicationName((prevNames) =>
      isChecked
        ? [...prevNames, app?.excubatorDomainEntity?.name]
        : prevNames.filter((name) => name !== app?.excubatorDomainEntity?.name)
    );
  };
  useEffect(() => {
    if (Array.isArray(activeApplicationName)) {
      console.log(activeApplicationName.join(", ")); // ✅ Safe usage
    } else {
      console.log("activeApplicationName is not an array", activeApplicationName);
    }
  }, [activeApplicationName]);

  // To Save Application Data
  // const handleSaveDomainData = () => {
  //   dispatch(saveUserSelection(activeApplicationId, userId));
  //   setFormVisible(true);
  // };

  const handleCheckbox = (isChecked) => {
    setSelectCheckBox(isChecked);

    if (isChecked) {
      // Select all applications
      const allAppIds = applications.map((app) => app.id);
      const allAppName = applications.map((app) => app.excubatorDomainEntity?.name);
      setActiveApplicationId(allAppIds);
      console.log(allAppIds, allAppName);
      setActiveApplicationName(allAppName);
    } else {
      // Deselect all applications
      setActiveApplicationId([]);
      setActiveApplicationName([]);
      // setFormVisible(false);
    }
  };

  const createMandate = "mandate_limit";

  const [isAlertShown, setIsAlertShown] = useState(false);

  useEffect(() => {
    let isMounted = true; // To check if the component is still mounted
    let requestCounter = 0; // Track the number of API requests

    const checkInvestorSubscriptionLimit = async () => {
      const currentRequest = ++requestCounter; // Increment the request counter

      dispatch(investorSubscriptionLimitCheck(userId, createMandate)).then((res) => {
        if (isMounted && currentRequest === requestCounter) {
          if (res?.status === false && !isAlertShown) {
            setIsAlertShown(true);
            SWEETALERT({
              text: "Your Mandate posting limit has been reached. Please upgrade your plan to continue!",
            });
          }
        }
      });
    };

    // Call the function
    checkInvestorSubscriptionLimit();

    // Cleanup function to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [dispatch, isAlertShown, userId, createMandate]);

  return (
    <>
      <ExternalContainer>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Typography sx={headingTag}>Create Mandate</Typography>
            <Typography sx={{ fontWeight: "600", fontSize: "1rem", color: "#8B8787" }}>
              Pick a technology you want to find startups in. Don&apos;t worry, you can always add
              more technologies later. (By the way, these are the hottest technologies today.)
            </Typography>
            <Domain
              domains={domains}
              activeDomainId={activeDomainId}
              applications={applications}
              activeApplicationId={activeApplicationId}
              handleApplicationDetail={handleApplicationDetail}
              handleApplicationSelection={handleApplicationSelection}
              isNewSelectionMade={isNewSelectionMade}
              headingTag={headingTag}
              handleCheckbox={handleCheckbox}
              selectCheckBox={selectCheckBox}
              activeDomainName={activeDomainName}
              setOtherDomainData={setOtherDomainData}
              otherDomainData={otherDomainData}
              editMandateData={editMandateData}
            />

            <MandateForm
              headingTag={headingTag}
              investorId={investorId}
              userId={userId}
              activeDomainId={activeDomainId}
              activeApplicationId={activeApplicationId}
              otherDomainData={otherDomainData}
              activeDomainName={activeDomainName}
              activeApplicationName={activeApplicationName}
            />
          </>
        )}
      </ExternalContainer>
    </>
  );
};
Mandate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Mandate;
