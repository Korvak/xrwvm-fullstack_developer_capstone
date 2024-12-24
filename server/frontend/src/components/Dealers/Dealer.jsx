import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

function Dealer() {

  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  //let curr_url = window.location.href;
  let root_url = window.location.origin + "/"; //curr_url.substring(0,curr_url.indexOf("dealer"));
  console.log(root_url);
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`details/dealer/${id}`; //root_url+`djangoapp/dealer/${id}`;
  let reviews_url = root_url+`reviews/dealer/${id}`; //root_url+`djangoapp/reviews/dealer/${id}`;
  let post_review = root_url+`postreview/${id}`;
  
  const get_dealer = async ()=> {
    try {
      const resp = await fetch(dealer_url, {
      method: "GET"
      });
      const retobj = await resp.json();

      if(resp.ok) {
        setDealer(retobj.dealer);
      }
      else {
        throw new Error(`response returned status code : ${resp.status}`);
      }
    }
    catch(error) {
      console.error(error.message);
    }
  };

  const get_reviews = async ()=>{
    const resp = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await resp.json();
    
    if(resp.ok) {
      if(retobj.reviews.length > 0){
        setReviews(retobj.reviews)
      } else {
        setUnreviewed(true);
      }
    }
  };

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  };

  let reviewComps = unreviewed ? <div>No reviews yet! </div> : <text>Loading Reviews....</text>;

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>)

      
    }
  },[]);  


return(
  <div style={{margin:"20px"}}>
      <Header/>
      <div style={{marginTop:"10px"}}>
      <h1 style={{color:"grey"}}>{dealer.full_name}{postReview}</h1>
      <h4  style={{color:"grey"}}>{dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} </h4>
      </div>
      <div class="reviews_panel">
      {reviews.length > 0 ?
        reviews.map(review => (
          <div className='review_panel'>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment'/>
            <div className='review'>{review.review}</div>
            <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
          </div>
        )) : reviewComps
      }
    </div>  
  </div>
)
}

export default Dealer;
