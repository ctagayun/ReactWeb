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

//see Module 4- React Details Component
//https://app.pluralsight.com/ilx/video-courses/fbbac3b2-0e56-464b-92f2-0b877f92f12c/6feac58d-c6dc-40ae-afd9-6358f0bf8bc1/186797d5-0998-4f0f-be58-47b855a6e15e
//using react-query 
//     - no need to call useState because useQuery takes car of manging the state for us
//     - no need to call useEffect it exposes the functionality using "hooks"
//     - no need to declare the return type. remove the House[]  
//       in const useFetchHouses = (): House[] - using axios we can infer the retrn type

 const useFetchHouses = () => {  //Infer the return type no more Houses[] param
  return useQuery<House[], AxiosError>({
                          //useQuery - is a hook that has internal state and therefore our fetch houses
                          //hook that we define here will therefore re-render when internal state
                          //of useQuery changes and that causes all components that uses useFetchHouses to re-render as well
                          //House[] - is the type of data we expect to get. in this case an array of House type
                          //AxiosError - is type data that we expect to get. in this case AxiosError

    queryKey: ["houses"], //this is the cache key. It has to be in the form of an array.
                          //this means when this hook executes a separate cache will be created 

    queryFn: () =>        //this is the function that gets the data. Doesn't have to be axios to get data. You can use fetch too.
           axios.get(`${config.baseApiUrl}/houses`).then ((resp) => resp.data),
                          //baseApiUrl - the first parameter is the Url where it should get the data from.
                          //resp.data  - and it is returning the "data" from the response object "resp.data". 
  });
} //eof useFetchHouses

//Detl 
//https://app.pluralsight.com/ilx/video-courses/fbbac3b2-0e56-464b-92f2-0b877f92f12c/8c582716-546d-4dbb-a88c-51541498ae9f/9e176161-3009-4fb0-8478-7e3ed666d2fc

//This means when this hook executes we pass in house id and a
//separate cache will be created for this PARTICULAR house id
const useFetchHouse = (id: number) => {
  return useQuery<House, AxiosError>({
    queryKey: ["houses", id], //this means when this hook executes we pass in ID and a 
                              //separate will be cache will be created for this particular house ID.
                              //when this hook is re-remdered by the component that mounts it with the  
                              //same id and the cache is still valid, the house will be returned from cache
    queryFn: () =>
      axios.get(`${config.baseApiUrl}/house/${id}`).then((resp) => resp.data),
                              //baseApiUrl/id - the first parameter is the Url where it should get the data from.
                              //resp.data  - and it is returning the "data" from the response object "resp.data". 
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
