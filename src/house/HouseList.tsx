 
// import { currencyFormatter } from "../config";
// import { useFetchHouses } from "../hooks/HouseHooks";
// import ApiStatus from "../apiStatus";
// import { useNavigate } from "react-router-dom";
// import { House } from "../types/house";
// import { Link } from "react-router-dom"; //crud
// import useFetchUser from "../hooks/UserHooks";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { currencyFormatter } from "../config";
import { useFetchHouses } from "../hooks/HouseHooks";
import { House } from "../types/house";
import useFetchUser from "../hooks/UserHooks";
import ApiStatus from "../apiStatus";

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
  
  //we are calling useFetchUser here also in addition to calling it in app.tsx - implCookieReact
  const { data: userClaims } = useFetchUser(); //rename data: to userClaims to avoid conflicts because axios returns resp.data

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
      
      {userClaims && //added under implCookieReact. check if the user has rights. in other words the claim role has value admin. If that's the case I am displaying the button
        userClaims.find((c) => c.type === "role" && c.value === "Admin") && (
          <Link className="btn btn-primary" to="/house/add">
             Add
          </Link>
        )}
      
    </div>
  );
};

export default HouseList;

// Do not use A tag because it will cause a reload. Use "Link" instead
//to="/house/add"> when button is pressed goto to="/house/add">