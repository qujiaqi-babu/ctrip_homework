import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

const StarRating = ({ rating, totalStars, starSize, onPress }) => {
  const starFilled = require("../public/star_light.png"); // 亮星星图标
  const starEmpty = require("../public/star_dark.png"); // 暗星星图标

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress(i)}
          style={{ padding: 3 }}
        >
          <Image
            source={i < rating ? starFilled : starEmpty}
            style={{ width: starSize, height: starSize }}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
};

export default StarRating;
