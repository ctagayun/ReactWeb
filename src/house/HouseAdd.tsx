//crud
import { useAddHouse } from "../hooks/HouseHooks";
import { House } from "../types/house";
//import ValidationSummary from "../ValidationSummary";
import HouseForm from "./HouseForm";

const HouseAdd = () => {
  const addHouseMutation = useAddHouse();

  //we need the House instance to pass to the form Houseadd.tsx component. 
  //so we import it: 
  //because we are adding a house, all property values are empty or zero
  const house: House = {
    address: "",
    country: "",
    description: "",
    price: 0,
    id: 0,
    photo: "",
  };

  return (
    <>
      {/* {addHouseMutation.isError && (
        <ValidationSummary error={addHouseMutation.error} />
      )} */}
      <HouseForm //all that's left now is to render the form passing the "house: House" as prop
        house={house}
        submitted={(house) => addHouseMutation.mutate(house)}  
                             //this will do the actual POST request. 
                             //to add a house use addHouseMutation
      />
    </>
  );
};

export default HouseAdd;
