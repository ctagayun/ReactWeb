//added implCookieReact
import axios, { AxiosError } from "axios";
import Config from "../config";
import { Claim } from "../types/claim";
import { useQuery } from "@tanstack/react-query";

const useFetchUser = () => {
  return useQuery<Claim[], AxiosError>({  //it returns a claim array. Claim is K/V containing a type and value
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get(`${Config.baseApiUrl}/account/getuser?slide=false`)
        .then((resp) => resp.data),
  });
};
export default useFetchUser;
