//import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { currencyFormatter } from "../config";
import { useFetchHouses } from "../hooks/HouseHooks";
import ApiStatus from "../apiStatus";
import { useNavigate } from "react-router-dom";
import { House } from "../types/house";

//import { House } from "../types/house";
//import config from "../config";

const HouseList = () => {

  const nav = useNavigate();  //navclick. This is a Hook that returns a 
             //function that takes a string with a URL to navigate to.
             //Note: useNavigate() will NOT create a request to the server.
             //      it will use the internal routing system.
             //A normal redirect using window location ref for example will 
             //work too but the entire application will be RELOADED from the 
             //server after which the routing mechanism will determine the 
             //RIGHT component to dispaly
  //This hook returns "data" so we need to destructure it
  const {data, status, isSuccess} = useFetchHouses(); 
  
  if (!isSuccess)
    return <ApiStatus status={status} />
  return (
    <div>
      <div className="row mb-2">
        <h5 className="themeFontColor text-center">
          Houses currently on the market
        </h5>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Address</th>
            <th>Country</th>
            <th>Asking Price</th>
          </tr>
        </thead>
        <tbody>
        {data &&
            data.map((h: House) => (
              <tr key={h.id} onClick={() => nav(`/house/${h.id}`)}>
                <td>{h.address}</td>
                <td>{h.country}</td>
                <td>{currencyFormatter.format(h.price)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default HouseList;
