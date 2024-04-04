//crud
import { useParams } from "react-router-dom";
import ApiStatus from "../apiStatus";
import { useFetchHouse, useUpdateHouse } from "../hooks/HouseHooks";
import ValidationSummary from "../ValidationSummary";
import HouseForm from "./HouseForm";


const HouseEdit = () => {
  const { id } = useParams();  //first get id from url using useParams

  if (!id) throw Error("Need a house id"); //throw error if no id

  const houseId = parseInt(id); //convert to int

  //Return type of useFetchHouse is "data.house, status"
  const { data, status, isSuccess } = useFetchHouse(houseId);

  const updateHouseMutation = useUpdateHouse(); //init updateHouseMutation with useUpdateHouse() hook we wrote in HouseHooks.ts

  if (!isSuccess) return <ApiStatus status={status} />;

  return (
    <>
      {updateHouseMutation.isError && (  //add ValidationSummary component. First check if the mutation has returned an error
        <ValidationSummary error={updateHouseMutation.error} />  //if so render a validation summary passing the 
                                                              //error property of the mutation which is now of type 
                                                              //AxiosError of type Problem.
       )}
      <HouseForm
        house={data}
        submitted={(house) => {
          updateHouseMutation.mutate(house); //to update the house use: "updateHouseMutation"
        }}
      />
    </>
  );
};

export default HouseEdit;
