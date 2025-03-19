import axios from "axios";

/*
 **API BASE URL
 */

export const REST_API = "https://lnkbydic.backend.hyperthings.in/api";

// const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// export const REST_API = apiUrl;

//For Captcha Implementation

export const RECAPTCHA_SITE_KEY = "6LdPGqYqAAAAALQdEzhBEKdQmEht1umd4OkgB2Uj";

/*
 ** Axios Instance Function Created
 */

const createFetcher = () => {
  const token = localStorage.getItem("token");
  const fetcher = axios.create({
    baseURL: REST_API,
    timeout: 60000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Create another instance for text/plain requests
  const fetcherPlainText = axios.create({
    baseURL: REST_API,
    timeout: 15000,
    headers: {
      "Content-Type": "text/plain", // Setting Content-Type to text/plain
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  // Add the fetcherPlainText as a property to fetcher
  fetcher.plainText = fetcherPlainText;

  // Create another instance for multipart/form-data requests
  const fetcherPdf = axios.create({
    baseURL: REST_API,
    timeout: 15000,
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  // Add the fetcherPdf as a property to fetcher
  fetcher.fetcherPdfData = fetcherPdf;
  // fetcher.interceptors.response.use(
  //   response => response, // Return the response if it's successful
  //   error => {
  //     if (error.response && error.response.status === 401) {
  //       // Handle unauthorized error (401)
  //       localStorage.removeItem("token"); // Clear token from localStorage

  //       // Redirect user to login page (using React Router's useHistory)
  //       // If you're not using React Router, replace this with window.location.href or another redirection method
  //       window.location.href = "/"; // or use history.push('/login') if using react-router

  //       // Optionally, you can also log the user out of the application here
  //       // For example, dispatch a logout action if you're using Redux

  //       // You can reject the promise here to stop further actions
  //       return Promise.reject(error);
  //     }
  //     // For other errors, just return the error as is
  //     return Promise.reject(error);
  //   }
  // );

  return fetcher;
};

/*
 **This function is an asynchronous function that takes three parameters: url, method, and body  
   It uses the Axios instance (fetcher) to make a request to the specified url
 */

// Modify the sendRequest function to accept a parameter for the request type
export const sendRequest = async (url, method, body, requestType) => {
  /*
   **This will called the function create fetcher everytime when a new request is send to the server 
     it runs the function which takes the token everytime from the local storage.
   */
  const fetcher = createFetcher();

  // Use the appropriate axios instance based on the request type
  const axiosInstance =
    requestType === "plain"
      ? fetcher.plainText
      : requestType === "pdf"
      ? fetcher.fetcherPdfData
      : fetcher;

  const res = await axiosInstance({
    method,
    url,
    data: body,
  });

  return res.data;
};

export const updateFetcherToken = (token) => {
  const fetcher = createFetcher();
  fetcher.defaults.headers.common.Authorization = `Bearer ${token}`;
};
