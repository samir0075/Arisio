import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  alphaNumericChar,
  digitRegex,
  emailRegex,
  linkedInRegex,
  NotMoreThan20CharactersWithoutSpace,
  urlRegex,
} from "src/components/validators";
import CustomTextField from "src/components/TextField";
import SelectField from "src/components/SelectField";
import ImageField from "src/components/ImageField";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Enter Full Name")
    .min(2, "Name should be at least 2 characters")
    .max(50, "Name should not exceed 50 characters")
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
      message: "Name must be alphabetic with no spaces.",
    })
    .matches(NotMoreThan20CharactersWithoutSpace, {
      message: "You cannot enter more than 20 letters in a row without a space.",
    }),

  email: yup
    .string()
    .required("Enter  communication email")
    .matches(emailRegex, () => "Enter a valid communication email"),

  // contactCode: yup.string().required("Enter Country Code"),

  mobile: yup
    .string()
    .required(" Enter  contact no.")
    .matches(/^[0-9]+$/, () => "Contact number should only contain numbers")
    .min(8, "Number should be at least 8 digits")
    .max(15, "Number should not exceed 15 digits"),
  industry: yup.array().min(1, "Select at least one Industry"),
  subArea: yup.string().min(1, "Select at least one Sub Area"),
  country: yup.array().min(1, "Select at least one Country"),
  city: yup.array().min(1, "Select at least one City"),
  description: yup
    .string()
    .required("Enter the description")
    .min(2, "Description should be at least 2 characters")
    .max(450, "Description should not exceed 450 characters")
    .matches(NotMoreThan20CharactersWithoutSpace, {
      message: "You cannot enter more than 20 letters in a row without a space.",
    })
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
      message: "Description must be alphabetic with no spaces.",
    }),
  website: yup
    .string()
    .required("Enter website url")
    .matches(urlRegex, () => "Enter a valid Link"),
  linkedIn: yup
    .string()
    .required("Enter LinkedIn url")
    .matches(linkedInRegex, () => "Enter a valid Link"),

  fees: yup
    .string()
    .required("Enter Consultation Fees")
    .min(2, "Consultation Fees should be at least 2 characters")
    .max(10, "Consultation Fees should not exceed 10 characters")
    .matches(alphaNumericChar, {
      message: "Consultation Fees must be alpha numeric.",
    }),

  duration: yup.string().min(1, "Select Duration"),
  accountNo: yup
    .string()
    .required("Enter Account Number")
    .min(2, "Account Number should be at least 2 numbers")
    .max(25, "Account Number should not exceed 25 numbers")
    .matches(digitRegex, {
      message: "Account Number must be numeric.",
    }),
  iban: yup
    .string()
    .required("Enter IBAN ")
    .min(2, "IBAN should be at least 2 characters")
    .max(25, "IBAN should not exceed 25 characters")
    .matches(alphaNumericChar, {
      message: "IBAN must be alpha numeric characters.",
    }),
  swiftCode: yup
    .string()
    .required("Enter SWIFT Code")
    .min(8, "SWIFT Code should be at least 8 numbers")
    .max(11, "SWIFT Code should not exceed 11 numbers")
    .matches(digitRegex, {
      message: "SWIFT Code must be numeric.",
    }),
  profile: yup.mixed().required("Profile Picture is mandatory"),
});

const INDUSTRY_DROPDOWN = [
  {
    id: 1,
    name: "Industry 1",
  },
  {
    id: 2,
    name: "Industry 2",
  },
  {
    id: 3,
    name: "Industry 3",
  },
];

const MentorProfile = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const onSubmit = (data, event) => {
    event.preventDefault(); // Prevent page refresh
    console.log("Form Data:", data);
  };

  return (
    <>
      <Box sx={{ background: "#FFF", p: 2 }}>
        <Typography sx={{ fontWeight: "600", fontSize: "1.2rem", color: "#1D2026" }}>
          Mentor Profile
        </Typography>
      </Box>

      {/* FORM  */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ background: "#FFF", p: 4, my: 2 }}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={12} lg={8}>
              {/* Full Name */}

              <CustomTextField
                label={"Full Name"}
                placeholder={"Enter Full Name"}
                keyName={"name"}
                isRequired={true}
                register={register}
                errors={errors}
              />

              {/* Email  */}
              <CustomTextField
                label={"Email"}
                placeholder={"Enter Email"}
                keyName={"email"}
                isRequired={true}
                register={register}
                errors={errors}
              />

              {/* Phone Number  */}
              <CustomTextField
                label={"Phone Number"}
                placeholder={"Enter Phone Number"}
                keyName={"mobile"}
                isRequired={true}
                register={register}
                errors={errors}
              />

              <Grid container spacing={2} alignItems="center">
                {/* Industry */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <SelectField
                    label={"Industrial Area"}
                    keyName={"industry"}
                    placeholder={"Enter Industrial Area"}
                    dropdownArray={INDUSTRY_DROPDOWN}
                    errors={errors}
                    styling={{ width: "100%" }}
                    isMultiple={true}
                    control={control}
                    isRequired={true}
                  />
                </Grid>

                {/* Sub Area */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <SelectField
                    label={"Sub Area"}
                    keyName={"subArea"}
                    placeholder={"Enter Sub Area"}
                    dropdownArray={INDUSTRY_DROPDOWN}
                    errors={errors}
                    styling={{ width: "100%" }}
                    isMultiple={false}
                    control={control}
                    isRequired={true}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                {/* Country */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <SelectField
                    label={"Country"}
                    keyName={"country"}
                    placeholder={"Enter Country"}
                    dropdownArray={INDUSTRY_DROPDOWN}
                    errors={errors}
                    styling={{ width: "100%" }}
                    isMultiple={true}
                    control={control}
                    isRequired={true}
                  />
                </Grid>

                {/* City */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <SelectField
                    label={"City"}
                    keyName={"city"}
                    placeholder={"Enter City"}
                    dropdownArray={INDUSTRY_DROPDOWN}
                    errors={errors}
                    styling={{ width: "100%" }}
                    isMultiple={true}
                    control={control}
                    isRequired={true}
                  />
                </Grid>
              </Grid>

              {/* Description */}
              <CustomTextField
                label={"Description"}
                placeholder={"Enter Description"}
                keyName={"description"}
                isRequired={true}
                register={register}
                errors={errors}
                multiline={"4"}
              />

              <Grid container spacing={2} alignItems="center">
                {/* Website */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomTextField
                    label={"Website"}
                    placeholder={"Enter Website url"}
                    keyName={"website"}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                </Grid>

                {/* LinkedIn */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <CustomTextField
                    label={"LinkedIn"}
                    placeholder={"Enter LinkedIn url"}
                    keyName={"linkedIn"}
                    isRequired={true}
                    register={register}
                    errors={errors}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Mentor Profile  */}
            <Grid container justifyContent="center" xs={12} sm={12} md={12} lg={4}>
              <ImageField
                label={"Mentor Profile"}
                keyName={"profile"}
                errors={errors}
                isRequired={true}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                control={control}
                setValue={setValue}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ background: "#FFF", p: 2, my: 2 }}>
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "1rem",
              color: "#1D2026",
              mt: 1,
              background: "#f5f5f5",
              p: 2,
            }}
          >
            Consultation Charges
          </Typography>

          <Grid container spacing={2}>
            {/* Consultation Fees*/}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomTextField
                label={"Consultation Fees"}
                placeholder={"Enter Consultation Fees"}
                keyName={"fees"}
                isRequired={true}
                register={register}
                errors={errors}
              />
            </Grid>
            {/* Duration  */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <SelectField
                label={"Duration"}
                keyName={"duration"}
                placeholder={"Enter Duration"}
                dropdownArray={INDUSTRY_DROPDOWN}
                errors={errors}
                styling={{ width: "100%" }}
                isMultiple={false}
                control={control}
                isRequired={true}
              />
            </Grid>
          </Grid>

          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "1rem",
              color: "#1D2026",
              mt: 1,
              background: "#f5f5f5",
              p: 2,
            }}
          >
            Bank Details
          </Typography>

          {/* Account Number  */}
          <CustomTextField
            label={"Account Number"}
            placeholder={"Enter Account Number"}
            keyName={"accountNo"}
            isRequired={true}
            register={register}
            errors={errors}
          />

          {/* IBAN  */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomTextField
                label={"IBAN"}
                placeholder={"Enter IBAN"}
                keyName={"iban"}
                isRequired={true}
                register={register}
                errors={errors}
              />
            </Grid>

            {/* Swift Code  */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomTextField
                label={"SWIFT code"}
                placeholder={"Enter SWIFT code"}
                keyName={"swiftCode"}
                isRequired={true}
                register={register}
                errors={errors}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            type="submit"
            size="medium"
            style={{ backgroundColor: "#8A1538", color: "#ffff" }}
          >
            Update
          </Button>
        </Grid>
      </form>
    </>
  );
};

export default MentorProfile;
