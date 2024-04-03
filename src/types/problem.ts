//needed by mute
type Error = {
    [name: string]: string[];
  };
  
  //vald
  type Problem = {
    type: string;
    title: string;
    status: number;
    errors: Error;
  };
  
  export default Problem;