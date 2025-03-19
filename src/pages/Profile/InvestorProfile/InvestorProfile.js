import React, { useEffect, useState } from "react";
import InvestorTab from "./InvestorTab";
import { useDispatch, useSelector } from "react-redux";
import { getInvestorDocument } from "src/action/investorProfileStepper";

const InvestorProfile = () => {
  const [value, setValue] = useState(0);
  const profile = "NewProfile";
  const dispatch = useDispatch();

  const storedUserDetails = localStorage.getItem("userDetails");
  const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
  const investorId = userDetails?.investorId;

  useEffect(() => {
    dispatch(getInvestorDocument(investorId));
  }, [dispatch, investorId]);

  const documentList = useSelector((state) => state.investorProfileStepper?.documents?.data);

  return (
    <>
      <InvestorTab
        newProfile={profile}
        value={value}
        setValue={setValue}
        documentList={documentList}
      />
    </>
  );
};

export default InvestorProfile;
