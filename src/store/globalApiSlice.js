import { createSlice } from "@reduxjs/toolkit";

const globalApiSlice = createSlice({
  name: "global",
  initialState: {
    domain: [],
    technologies: [],
    categories: [],
    countries: [],
    cities: [],
    countryNumberCode: [],
    startupsNameData: [],
    location: {},
    pricingPoints: [],
    venueType: [],
    loading: false,
    pricingPointsLoading: true,
    
  },
  reducers: {
    fetchDomain(state, action) {
      state.domain = action.payload.domain;
    },
    fetchTechnologies(state, action) {
      state.technologies = action.payload.technologies;
    },
    fetchCategories(state, action) {
      state.categories = action.payload.categories;
    },
    fetchCountries(state, action) {
      state.countries = action.payload.countries;
    },
    fetchCities(state, action) {
      state.cities = action.payload.cities;
    },
    fetchCountryNumberCode(state, action) {
      state.countryNumberCode = action.payload.countryNumberCode;
    },
    fetchEventVenueType(state, action) {
      state.venueType = action.payload.venueType;
    },
    fetchCompaniesLike(state, action) {
      state.startupsNameData = action.payload.startupsNameData;
    },
    fetchPricingDetails(state, action) {
      state.pricingPoints = action.payload.pricingPoints;
    },
    fetchLocation(state, action) {
      state.location = action.payload.location;
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set loading state based on the payload
    },
    setpricingPointsLoading (state ,action) {
      state.pricingPointsLoading=action.payload
    }
  }
});
export const globalApiActions = globalApiSlice.actions;

export default globalApiSlice;
