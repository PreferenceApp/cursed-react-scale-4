import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Query,
  tablesDB,
} from "../appwrite";

import { useUser } from "./UserContext";
import { useEvent } from "./EventContext";


const PlayerContext = createContext();



export function usePlayer() {
  return useContext(PlayerContext);
}




export function PlayerProvider({ children }) {


  const {
    user,
    userLoading
  } = useUser();


  const {
    event
  } = useEvent();



  const [player, setPlayer] = useState(null);

  const [players, setPlayers] = useState([]);



  const [playerLoading, setPlayerLoading] = useState(true);

  const [playersLoading, setPlayersLoading] = useState(true);





  async function refreshPlayer() {


    setPlayerLoading(true);



    if (!user) {


      setPlayer(null);

      setPlayerLoading(false);

      return;

    }



    try {


      const result =
        await tablesDB.listRows({

          databaseId: "db",

          tableId: "players",

          queries: [

            Query.equal(
              "userId",
              user.$id
            )

          ],

        });



      setPlayer(
        result.rows[0] ?? null
      );



    } catch(error) {


      console.error(
        "Failed loading player:",
        error
      );


      setPlayer(null);



    } finally {


      setPlayerLoading(false);


    }


  }







  async function refreshPlayers() {


    setPlayersLoading(true);



    if (
      !user ||
      !event
    ) {


      setPlayers([]);

      setPlayersLoading(false);

      return;

    }




    try {


      const result =
        await tablesDB.listRows({

          databaseId: "db",

          tableId: "players",

          queries: [

            Query.equal(
              "event",
              event.eventId
            )

          ],

        });



      setPlayers(
        result.rows
      );



    } catch(error) {


      console.error(
        "Failed loading players:",
        error
      );


      setPlayers([]);



    } finally {


      setPlayersLoading(false);


    }


  }







  async function registerPlayer(playerName) {


    if (
      !user ||
      !event
    ) {

      throw new Error(
        "Missing user or event"
      );

    }



    const row =
      await tablesDB.upsertRow({

        databaseId:"db",

        tableId:"players",

        rowId: player?.$id,

        data: {

          userId:user.$id,

          playerName,

          event:event.eventId,

        },

      });



    setPlayer(row);



    await refreshPlayers();


  }








  async function unregisterPlayer() {


    if(!player)
      return;



    const row =
      await tablesDB.upsertRow({

        databaseId:"db",

        tableId:"players",

        rowId:player.$id,

        data:{

          ...player,

          event:null,

        },

      });



    setPlayer(row);



    await refreshPlayers();


  }








  /*
    Wait for UserContext to finish
    before checking player
  */

  useEffect(()=>{


    if(userLoading)
      return;



    refreshPlayer();



  },[
    user,
    userLoading
  ]);








  /*
    Reload registered players
    whenever user/event changes
  */

  useEffect(()=>{


    if(userLoading)
      return;



    refreshPlayers();



  },[
    user,
    event,
    userLoading
  ]);







  const isRegistered =
    Boolean(

      player?.event &&

      event?.eventId &&

      player.event === event.eventId

    );








  return (

    <PlayerContext.Provider

      value={{

        player,

        players,


        playerLoading,

        playersLoading,


        isRegistered,


        registerPlayer,

        unregisterPlayer,


        refreshPlayer,

        refreshPlayers,

      }}

    >

      {children}

    </PlayerContext.Provider>

  );


}