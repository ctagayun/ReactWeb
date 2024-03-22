
/*
   - refer to https://app.pluralsight.com/ilx/video-courses/fbbac3b2-0e56-464b-92f2-0b877f92f12c/7c99c5ed-967e-43f7-aa55-7cbca139b289/9f92a0f1-17b4-469f-95d8-624f5adb9542
     on how to create React project using Vite

   - npm install bootstra@5 on project terminal window

   - change vite.config. Add server node to run app
     in port 3000
*/

import './App.css'
import Header from './Header'

function App() {
    return (
       <div className='container'>
          <Header subtitle="Providing houses all over the world">

          </Header>
       </div>
    )
}

export default App
