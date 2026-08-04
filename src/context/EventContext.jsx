import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
  tablesDB
} from "../appwrite";



const EventContext=createContext();



export function useEvent(){

 return useContext(EventContext);

}





export function EventProvider({children}){


 const [event,setEvent]=useState(null);

 const [eventLoading,setEventLoading]=useState(true);




 async function refreshEvent(){


  setEventLoading(true);



  try{


    const current =
      await tablesDB.getRow({

        databaseId:"db",

        tableId:"events",

        rowId:"event",

      });



    setEvent(current);



  }catch(error){


    console.error(
      "Failed loading event:",
      error
    );


    setEvent(null);



  }finally{


    setEventLoading(false);


  }


 }





 useEffect(()=>{

   refreshEvent();

 },[]);





 return(

  <EventContext.Provider

    value={{

      event,

      eventLoading,

      refreshEvent,

      setEvent,

    }}

  >

    {children}

  </EventContext.Provider>

 );


}