import { useParams } from "react-router-dom";
import ApiStatus from "../apiStatus";
import { useFetchHouse, useUpdateHouse } from "../hooks/HouseHooks";
import ValidationSummary from "../ValidationSummary";
import HouseForm from "./HouseForm";

const HouseEdit = () => {
  const { id } = useParams();  //get id from url
  if (!id) throw Error("Need a house id");
  const houseId = parseInt(id);

  //Return type of useFetchHouse is "data.house, status"
  const { data, status, isSuccess } = useFetchHouse(houseId);

  const updateHouseMutation = useUpdateHouse();

  if (!isSuccess) return <ApiStatus status={status} />;

  return (
    <>
      {updateHouseMutation.isError && (
        <ValidationSummary error={updateHouseMutation.error} />
      )}
      <HouseForm
        house={data}
        submitted={(house) => {
          updateHouseMutation.mutate(house);
        }}
      />
    </>
  );
};

export default HouseEdit;
