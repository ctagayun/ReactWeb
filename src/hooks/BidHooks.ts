//Bidder stuff
import { Bid } from "./../types/bid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Config from "../config";
import axios, { AxiosError, AxiosResponse } from "axios";
import Problem from "../types/problem";

//Fetch the bid
const useFetchBids = (houseId: number) => {
  return useQuery<Bid[], AxiosError<Problem>>({
                         //useQuery - is a hook that has internal state and therefore our fetch houses
                          //hook that we define here will therefore re-render when internal state
                          //of useQuery changes and that causes all components that uses useFetchHouses to re-render as well
                          //Bid[] - is the type of data we expect to get. in this case an array of Bid type
                         
                          //AxiosError -when error occurs using Axios it will produce an object 
                          //   of type "AxiosError".

    queryKey: ["bids", houseId],
                          //this is the cache key. It has to be in the form of an array.
                          //this means that when this hook executes a separate cache will be created 

    queryFn: () =>  //this is the function that gets the data. Doesn't have to be axios to get data. You can use fetch too.
      axios
        .get(`${Config.baseApiUrl}/house/${houseId}/bids`)
                          //baseApiUrl - the first parameter is the Url where it should get the data from.
                          //resp.data  - and it is returning the "data" from the response object "resp.data". 

        .then((resp) => resp.data),
  });
};

const useAddBid = () => {
  const queryClient = useQueryClient();
        //we need to invalidate the cache created by useFetchBids
        //so we need a useQueryClient object
  return useMutation<AxiosResponse, AxiosError<Problem>, Bid>({
        //We return result of useMutation again with AxiosResponse (1)
        //We return AxiosError (2) - when error occurs using Axios it will produce an object 
        //   of type "AxiosError". We can add a GENERIC PARAMETER to the axios error type
        //   to indicate that the error response will contain our custom "problem" type 
        //   defined in src/types/problem.ts
        //Return Bid (3) as generic parameter

    mutationFn: (b) => //in the implememtation we get "b" for bid as a parameter
                       //and post that to the POST endpoint
      axios.post(`${Config.baseApiUrl}/house/${b.houseId}/bids`, b),
                       //this is arrow function that executes the request
                       //(b) axios gets the house bid instance and post that
                       //(b) to the API endpoint like:  ${config.baseApiUrl}/house/${b.houseId}/bids`, b)
    onSuccess: (_, bid) => {
      queryClient.invalidateQueries({
        queryKey: ["bids", bid.houseId],
      });
    },
  });
};

export { useFetchBids, useAddBid };
