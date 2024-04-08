const config = {
  //baseApiUrl: "https://localhost:4000", //cookie hosting. not needed since we are running in the same domain.
  baseApiUrl: "", //cookie hosting. not needed since we are running in the same domain.
};

const currencyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default config;
export { currencyFormatter };
