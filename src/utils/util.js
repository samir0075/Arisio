import dayjs from "dayjs";

export const getButtonCss = () => ({
  background: "#eedce1",
  padding: "3px 8px",
  fontSize: "0.8rem",
  borderRadius: "5px",
});

export const isPermitted = (permission) => {
  const permissions = localStorage.getItem("permissions");
  // console.log("myper", permissions);
  return permissions?.includes(permission);
  // return true;
};

export const formattedDate = (date) => {
  // Check if the date is in the format "DD/MM/YYYY"
  const isDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/.test(date);

  // If it's in DD/MM/YYYY, manually rearrange it into a format that dayjs can parse
  if (isDDMMYYYY) {
    const [day, month, year] = date?.split("/");
    date = `${year}-${month}-${day}`;
  }

  // Now, dayjs will correctly parse it

  if (dayjs(date).format("DD/MM/YYYY") === "Invalid Date") {
    return date;
  } else {
    return dayjs(date).format("DD/MM/YYYY");
  }
};

export const formattedEventDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY hh:mm A");
};
