import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"


function Dealers() {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  const [states, setStates] = useState([]);
  const [dealersViewList, setDealersViewList] = useState([]);

  //let root_url = window.location.origin;
  const dealer_url = `${window.location.origin}/get_dealers`; //`${window.location.host}:${dealerPort}/get_dealers/test`; //"/djangoapp/get_dealers";

  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealersWithReq = async (state) => {
    dealer_url_by_state = dealer_url_by_state+state;
    const res = await fetch(dealer_url_by_state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      let state_dealers = Array.from(retobj.dealers)
      setDealersList(state_dealers)
    }
  }
   
  const filterDealers = (state) => {
    if (state.toLowerCase() === "all") {
      setDealersViewList(dealersList);
    }
    else if (state === "") {
      setDealersViewList([]);
    }
    else {
      setDealersViewList(
          dealersList.filter(dealer => dealer.state === state)
      );
    }
  }

  useEffect(() => {
    const get_dealers = async ()=>{
      try {
        const resp = await fetch(dealer_url, {
          method: "GET"
        });
        let retobj = await resp.json();
        if(resp.ok) {
          let all_dealers = Array.from(retobj.dealers);
          let states = [];
          all_dealers.forEach((dealer)=>{
            states.push(dealer.state)
          });
          setStates(Array.from(new Set(states)));
          setDealersList(all_dealers);
          setDealersViewList(all_dealers);          
        }
        else {
          throw new Error(`response returned status : ${retobj.status}`);
        }
      }
      catch(error) {console.error(error.message);} 
    };
    get_dealers().catch(console.error);
  },[dealer_url]);

let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;
return(
  <div>
      <Header/>

     <table className='table'>
      <tr>
      <th>ID</th>
      <th>Dealer Name</th>
      <th>City</th>
      <th>Address</th>
      <th>Zip</th>
      <th>
      <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
      <option value="" selected disabled hidden>State</option>
      <option value="All">All States</option>
      {states.map(state => (
          <option value={state}>{state}</option>
      ))}
      </select>        

      </th>
      {isLoggedIn ? (
          <th>Review Dealer</th>
         ):<></>
      }
      </tr>
     {dealersViewList.map(dealer => (
        <tr>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
     </table>;
  </div>
)
}

export default Dealers;
