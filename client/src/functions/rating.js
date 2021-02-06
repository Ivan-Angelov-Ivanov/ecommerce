import React from "react";
import StarRating from "react-star-ratings";

export const showAverage = (product) => {
  if (product && product.ratings) {
    let ratingsArray = product && product.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((rating) => total.push(rating.star));
    let totalReduced = total.reduce((previous, next) => previous + next, 0);
    let result = totalReduced / length;

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            rating={result}
            numberOfStar={5}
            isSelectable={false}
            starRatedColor="red"
          />({product.ratings.length})
        </span>
      </div>
    );
  }
};
