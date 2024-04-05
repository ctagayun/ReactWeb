import { useState } from "react";
import { useAddBid, useFetchBids } from "../hooks/BidHooks";
import {House} from "../types/house"
import { Bid } from "../types/bid";
import ApiStatus from "../apiStatus";
import { currencyFormatter } from "../config";

//create a type for the props 
type Args ={
     house: House  //we are expecting an instance of House prop
}

//we are destructuring the "house"
const Bids = ({house}: Args) => { //this means house is of type Args

   //this component displays the bids and also adds it to the DB
   //So we call useFetch and useAddBid
   const {data, status, isSuccess} = useFetchBids(house.id);

   const addBidMutation =useAddBid();

   //then we define and empty Bid entity
   const emptyBid = {
        id: 0,       //id must be zero because that will be assigned by the database
        houseId: house.id,
        bidder: "",
        amount: 0,
   };

   //We don't want the component to reset the bid everytime the component renders
   //so we use useState to manage the state
   const [bid, setBid] = useState<Bid>(emptyBid);

   //Then we use API status component again
   //React expects that all hooks are called conistently at each render.
   //Therefor Call all hooks (e.g. useState) before this line of code
   if (!isSuccess) return <ApiStatus status={status} />;

    const onBidSubmitClick = () => {
        addBidMutation.mutate(bid);
        setBid(emptyBid); //reset the Bid to empty after adding
    };
    
    return (
        <>
          <div className="row mt-4">
            <div className="col-12">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Bidder</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((b) => ( //we are creating a row in the table for each bid that displays
                      <tr key={b.id}>   
                        <td>{b.bidder}</td>
                        <td>{currencyFormatter.format(b.amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <input
                id="bidder"
                className="h-100"
                type="text"
                value={bid.bidder}  //input the value are bound to the bidder property
                onChange={(e) => setBid({ ...bid, bidder: e.target.value })} // onChange handler modifies the state
                placeholder="Bidder"
              ></input>
            </div>
            <div className="col-4">
              <input
                id="amount"
                className="h-100"
                type="number"
                value={bid.amount} //input the value are bound to the amount property
                onChange={(e) =>  // onChange handler modifies the state
                  setBid({ ...bid, amount: parseInt(e.target.value) })
                }
                placeholder="Amount"
              ></input>
            </div>
            <div className="col-2">
              <button
                className="btn btn-primary"
                onClick={() => onBidSubmitClick()} //finally the submit button click points to onBidSubmitClick
              >
                Add
              </button>
            </div>
          </div>
        </>
      );
    
}