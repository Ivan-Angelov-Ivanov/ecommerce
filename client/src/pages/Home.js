import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";
import Advantages from "../components/cards/Advantages";

const Home = () => {
  return (
    <>
      <div className="text-center font-weight-bold">
        <Jumbotron
          text={[
            "Current Popular Products",
            "Catch The New Promoitons",
            "Keep Up With The Latest Technology",
          ]}
        />
      </div>

      <Advantages />

      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals />

      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        Best Sellers
      </h4>
      <BestSellers />
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        Categories
      </h4>
      <CategoryList />
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        Sub Categories
      </h4>
      <SubList />
    </>
  );
};

export default Home;
