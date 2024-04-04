import { AxiosError } from "axios";
import Problem from "./types/problem";

//Create a type for the props of this component that
//contains the property "error" of type: AxiosError and of type Problem> (e.g. AxiosError<Problem>)
type Args = {
  error: AxiosError<Problem>;    //again "error" is a property of type AxiosError and type <Problem>
};

const ValidationSummary = ({ error }: Args) => {  //{ error }: Args is destructuring the error from Args

  //if HTTP response is  400  that's the response when there is a 
  //validation error. If not 400 meaning no error, then simply
  //return an empty .tsx.
  //The below syntax is how you get error code in axios
  if (error.response?.status !== 400) 
     return <></>; //return a fragment  

  //else let us get the validation error
  const errors = error.response?.data.errors;

  return (
    <>
      <div className="text-danger">Please fix the following:</div>

      
      {Object.entries(errors).map(([key, value]) => ( //now that we have the error we iterate over the 
                                                      //entries in a dictionary and display an unordered list
                                                      //for eack key joining each value. The key is the name of
                                                      //the input and the value is the validation error. (K/V)
        <ul key={key}>
          <li>
            {key}: {value.join(", ")}
          </li>
        </ul>
      ))}
    </>
  );
};

export default ValidationSummary;
