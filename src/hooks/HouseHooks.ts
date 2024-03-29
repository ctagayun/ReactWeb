import { useNavigate } from "react-router-dom"; //mute
import { House } from "./../types/house";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "../config";
import axios, { AxiosError, AxiosResponse } from "axios";
import Problem from "../types/problem"; //mute

//(): House[] means we are typing the return type
// const useFetchHouses = (): House[] => {
//   const [houses, setHouses] = useState<House[]>
//         ([]); 
//   useEffect(() => {
//    const fetchHouses = async () => {
//      const rsp = await fetch(`${config.baseApiUrl}/houses`);
//      const houses = await rsp.json();
//      setHouses(houses);
//    };
//    fetchHouses();
//   }, []) //EOF useEffect 
//          since we are specifyin an empty array
//          the function will fire only when the 
//          component is first rendered
//   return houses;
// } //eof useFetchHouses


//We will repalce the code above with the code below we 
//and to infer the return type. (we removed (): House[])

 //Note that we are not using useState and useEffect anymore
// because state is being managed by React.

//Note: useQuery is a hook that has a INTERNAL STATE.
//useFetchHook that we define here will therefore re-render
//when the internal state of useQuery changes.
//Therefore all components that use useFetchHouses and 
//child components to re-render as well.

//  1. useQuery is used to define the query something
//     that is fetching the data.
//     It has 2 parameters:
//         <House[], -- the type of data we expect to get
//                      in this case an array of house
//     The second paramater is the type we expect back when
//     something goes wrong. In this case AxiosError.


const useFetchHouses = () => {
  return useQuery<House[], AxiosError>({
    queryKey: ["houses"], //this is the cache key. It has to be in the form of an array
    queryFn: () =>        //this is the function that gets the data. Doesn't have to be axios toget data. You can use fetch too.
      axios.get(`${config.baseApiUrl}/houses`).then ((resp) => resp.data), //resp.data returns the data. go to houseList and change code to receive data
  });
} //eof useFetchHouses

//Detl
//This means when this hook executes we pass in house id and a
//separate cache will be created for this PARTICULAR house id
const useFetchHouse = (id: number) => {
  return useQuery<House, AxiosError>({
    queryKey: ["houses", id], //cache key is now an array with a combo of string houses and the id
    queryFn: () =>
      axios.get(`${config.baseApiUrl}/house/${id}`).then((resp) => resp.data), //<-- corresponds to the url we created
  });
};

//mute
//useAddHouse will use reactQuery to create the POST Http request to the APi
//the react Query hook is used for data mutations like 
//    POST, PUTS and DELETES is called "useMutation"
//return useMutation<AxiosResponse, AxiosError<Problem>, House>({
//       AxiosResponse - FIRST axios generic parameter for RESPONSE
//       AxiosError<>  - SECOND axios generic parameter for ERROR TYPE
//       House         - THIRD parameter is the TYPE we want to send to the api in the requestBody

//Note: if adding the house is successful we need to modify the cache that was cached 
//in fetchHouses() method. Because we now know that the cache is no longer correct because we 
//added a new record. We will use the useQueryClient() hook instance that we created earlier in 
//index.tsx to invalidate the houses query
const useAddHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();  //used to do the actual navigation to route (see line 88)
  return useMutation<AxiosResponse, AxiosError<Problem>, House>({
    //queryKey: ["houses", id], //no cache key because for mutations we dont cache anything
    mutationFn: (h) => axios.post(`${config.baseApiUrl}/houses`, h), //instead we just write 
                                               //the arrow function that executes the request
                                               //(h) axios gets the house instance. and post that
                                               //(h) to the API endpoint like:
                                               // ${config.baseApiUrl}/houses`, h)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] }); //invalidate the cache created in 
                                            //the fetchHouses. So now any attempt to use the cache
                                            //houses will be refetched from the api creating a 
                                            //fresh cache
      nav("/"); //we want to navigate to the list of houses when the "add" is completed
    },
  });
};

//The only differences fron useAddHouse are that we are now have to do a PUT request and 
//instead of going to the list of houses we are going to the DETAIL PAGE for the house
const useUpdateHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  return useMutation<AxiosResponse, AxiosError<Problem>, House>({
    mutationFn: (h) => axios.put(`${config.baseApiUrl}/houses`, h),
    onSuccess: (_, house) => {     //the first param is an underscore. in axios it means we dont have any in the first parameter
      queryClient.invalidateQueries({ queryKey: ["houses"] });  //invalidate the cache created in fetchHouses
      nav(`/house/${house.id}`); //navigate to house detail page
    },
  });
};

const useDeleteHouse = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  return useMutation<AxiosResponse, AxiosError, House>({
    mutationFn: (h) => axios.delete(`${config.baseApiUrl}/houses/${h.id}`), //no need to send the house. just send the id to delete
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["houses"] }); //invalidate the cache created in fetchHouses
      nav("/");
    },
  });
};

export {
   useFetchHouses,
   useFetchHouse, //detl
   useAddHouse, //mute
   useUpdateHouse, //mute
   useDeleteHouse, //mute
};
