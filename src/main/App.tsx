
/*
   - refer to https://app.pluralsight.com/ilx/video-courses/fbbac3b2-0e56-464b-92f2-0b877f92f12c/7c99c5ed-967e-43f7-aa55-7cbca139b289/9f92a0f1-17b4-469f-95d8-624f5adb9542
     on how to create React project using Vite

   - npm install bootstra@5 on project terminal window

   - change vite.config. Add server node to run app
     in port 3000
*/

import './App.css'

import Header from './Header';
import HouseList from '../house/HouseList';
import HouseEdit from "../house/HouseEdit"; //crud
import HouseAdd from "../house/HouseAdd";
import HouseDetail from "../house/HouseDetail"; //detl
import {BrowserRouter, Route, Routes} from 'react-router-dom'; //rtg
import useFetchUser from '../hooks/UserHooks';

function App() {
    //call the new hook we created to get the user: useFetchUser
    const { isSuccess } = useFetchUser(); //implCookieReact

    return (
      //rtg
      //detl - path="/house/:id" this will not literally expect colon id ":id" in the
      //       url. Instead we will expect the actual id of the house
      //crud: HouseEdit, HouseAdd
      
      //implCookieReact
      //{!isSuccess && <a href={loginUrl}>Login</a>} check if user was fetched successfully
      //if not display a login link using <a> tag
     <BrowserRouter> 
       <div className='container'>
          {!isSuccess && <a href="/account/login">Login</a>} 
          <Header subtitle="Providing houses all over the world">
          </Header>
          <Routes>
             <Route path="/" element={<HouseList />}></Route>
             <Route path="/house/add" element={<HouseAdd />}></Route>
             <Route path="/house/edit/:id" element={<HouseEdit />}></Route> 
             <Route path="/house/:id" element={<HouseDetail />}></Route>   
          </Routes>
       </div>
     </BrowserRouter>
    )
}

export default App

  //<Route path="/house/add" element={<HouseAdd />}></Route>
            // <Route path="/house/edit/:id" element={<HouseEdit />}></Route>
 