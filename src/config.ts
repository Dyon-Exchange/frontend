export const colors = {
  brand: "#332F7D",
  highlight: "#C9FFE5",
};

const env = process.env.REACT_APP_ENV;

let backendUrl: string;
if (env === "PROD") {
  backendUrl = "https://cru-world-wine.ts.r.appspot.com/";
} else if (env === "STAGING") {
  backendUrl = "https://staging-dot-cru-world-wine.ts.r.appspot.com/";
} else {
  backendUrl = "http://localhost:8080";
}

const config = {
  backendUrl,
};
export default config;
