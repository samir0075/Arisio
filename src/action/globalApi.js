import { globalApiActions } from "../store/globalApiSlice";
import { sendRequest } from "src/utils/request";

export const getDomains = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`domains`, "get");
      dispatch(
        globalApiActions.fetchDomain({
          domain: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getTechnologies = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`technologies`, "get");
      dispatch(
        globalApiActions.fetchTechnologies({
          technologies: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getCompaniesLike = (inputValue) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/startup/companyLike/${inputValue}`, "get");
      dispatch(
        globalApiActions.fetchCompaniesLike({
          startupsNameData: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getCategories = () => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  const id = userDetails?.id;

  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/${role === "ADMINISTRATOR" ? "admin" : "investor"}/${id}/cruchbase/categories`,
        "get"
      );
      dispatch(
        globalApiActions.fetchCategories({
          categories: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getCountries = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/funded_company_countries`, "get");
      dispatch(
        globalApiActions.fetchCountries({
          countries: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getCity = (countryValue) => {
  const userData = localStorage.getItem("userDetails");
  const userDetails = userData ? JSON.parse(userData) : null;
  const role = userDetails?.role;
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/${
          role === "ADMINISTRATOR"
            ? "admin"
            : role === "ENTREPRENEUR"
            ? "startup"
            : role === "INVESTOR"
            ? "investor"
            : "individual"
        }/cities_by_countryCodes?countryCode=${countryValue}`,
        "get"
      );
      dispatch(
        globalApiActions.fetchCities({
          cities: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getCountryNumberCode = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`/country_code_dialing`, "get");
      dispatch(
        globalApiActions.fetchCountryNumberCode({
          countryNumberCode: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const getEventVenueType = () => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(`admin/venue_Drop`, "get");
      dispatch(
        globalApiActions.fetchEventVenueType({
          venueType: res,
        })
      );
      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

// export const getCity = (countryValue) => {
//   return async (dispatch) => {
//     try {
//       const token = localStorage.getItem("token");
//       let res = await fetch(
//         `https://dic.hyperthink.io/core/api/investor/cities_by_countryCodes?countryCode=${countryValue}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             ...(token ? { Authorization: `Token ${token}` } : {}),
//           },
//         }
//       );
//       res = await res.json();
//       dispatch(
//         globalApiActions.fetchCities({
//           cities: res,
//         })
//       );
//       return res;
//     } catch (err) {
//       return err?.response?.data?.message;
//     }
//   };
// };

export const getLocation = () => {
  return async (dispatch) => {
    try {
      // const res = await fetch("https://api.ipify.org");
      // https://get.geojs.io/v1/ip/geo.json
      // const ipAddress = await res.text();
      // const response2 = await fetch(`http://ip-api.com/json/${ipAddress}`);
      // const response2 = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
      const response2 = await fetch(`https://get.geojs.io/v1/ip/geo.json`);
      if (!response2.ok) {
        throw new Error(`HTTP error! Status: ${response2.status}`);
      }
      const data = await response2.json();

      dispatch(
        globalApiActions.fetchLocation({
          location: data,
        })
      );

      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
};

export const getPricingDetails = () => {
  return async (dispatch) => {
    try {
      dispatch(globalApiActions.setpricingPointsLoading(true));
      const res = await sendRequest(`/website/plans_with_features`, "get");
      dispatch(globalApiActions.setpricingPointsLoading(false));

      dispatch(
        globalApiActions.fetchPricingDetails({
          pricingPoints: res,
        })
      );
      dispatch(globalApiActions.setpricingPointsLoading(false));
      return res;
    } catch (err) {
      dispatch(globalApiActions.setpricingPointsLoading(false));
      return err?.response?.data?.message;
    }
  };
};
export const startupSubscriptionLimitCheck = (userId, moduleLimit) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/startup/${userId}/check_limit?limit_type=${moduleLimit}`,
        "get"
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};

export const investorSubscriptionLimitCheck = (userId, moduleLimit) => {
  return async (dispatch) => {
    try {
      const res = await sendRequest(
        `/investor/${userId}/check_limit?limit_type=${moduleLimit}`,
        "get"
      );

      return res;
    } catch (err) {
      return err?.response?.data?.message;
    }
  };
};
