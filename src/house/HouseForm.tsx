import {useState} from "react";
import toBase64 from "../toBase64"; //upld
import {House} from "../types/house";

//add a type for the props of this component. There to items in the props of this component.
type args ={
     house: House; //1. the house instance
     submitted: (house: House) => void; //2. the function to be called when the form is submitted.
                                        //as a parameter we want to supply the filled out house.
}

//this component  needs two props :
//  1. house object and
//  2. the callback function "submitted"
const HouseForm = ({house, submitted}: args) => {
  
  //next we declare the STATE for the house. Initial state value
  //will be a new object called "houseState". It will be populated with 
  //all the K/V properties from the PROP "house" by using the spread operator.

  //Note: the "house" type is a REFERENCE type (NOT VALUE TYPE) so any changes to it 
  //will be visible/reflected on all components that is referencing 
  //"house". Remember VALUE TYPES are passed as "copy". REFERENCE TYPEs are
  //passed the pointers to the address location of the variable 
  //(remember "C" programming)

  //So we need a new object "houseState" so that when the user changes 
  //the form (e.g country) the change will remain local

   const [houseState, setHouseState] = useState({ ...house });

   const onSubmit: React.MouseEventHandler<HTMLButtonElement> = 
      async (e) => {
           e.preventDefault();
           submitted(houseState);
     };

     //upld
     //this syntax: e: React.ChangeEvent<HTMLInputElement
     //is defining the type of "e:" which is React.ChangeEvent<HTMLInputElement> TYPE
     const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement> //gets the change event TYPE as parammeter
      ): Promise<void> => { //it is an async function returning and empty <void> promise
         e.preventDefault(); //first thing to be done is to prevent the default behavior which is reloading the browser
         e.target.files &&  e.target.files[0] &&  //second check if there are files 
                                                  //on the target of the event.
                                                  //The target is the HTML input element 
                                                  //
                                                  //and if there are files we also we want 
                                                  //to make sure it is the first file
            //and if it is the first file we want to modify 
            //the houseState so that the photo gets added but first
            //we need to convert the first file to string: await toBase64(e.target.files[0]
            //no need for external libraries. We are using the function toBase64 
            //to convert the file. we have to write the function in /src/toBase64
            setHouseState({...houseState, photo: await toBase64(e.target.files[0]),
          });
      };

  return(
    <form className="mt-2">
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          className="form-control"
          placeholder="Address"
          value={houseState.address}
          onChange={(e) =>
            setHouseState({ ...houseState, address: e.target.value }) //after setting "houseState", address: e.target.value will override the original value of the houseState.address. Because the state changes the component will render a new value
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          className="form-control"
          placeholder="Country"
          value={houseState.country}
          onChange={(e) =>
            setHouseState({ ...houseState, country: e.target.value })
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="description">Description</label>
        <textarea
          className="form-control"
          placeholder="Description"
          value={houseState.description}
          onChange={(e) =>
            setHouseState({ ...houseState, description: e.target.value })
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          className="form-control"
          placeholder="Price"
          value={houseState.price}
          onChange={(e) =>
            setHouseState({ ...houseState, price: parseInt(e.target.value) })
          }
        />
      </div>
      <div className="form-group mt-2">
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="file"
          className="form-control"
          onChange={onFileSelected}
        />
      </div>
      <div className="mt-2">
        <img src={houseState.photo}></img>
      </div>
      <button
        className="btn btn-primary mt-2"
        disabled={!houseState.address || !houseState.country}
        onClick={onSubmit}
      >
        Submit
      </button>
    </form>
  );

   

}

export default HouseForm;

//disabled={!houseState.address || !houseState.country}