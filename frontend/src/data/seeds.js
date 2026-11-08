import carrotImage from "../assets/carrot.png";
import tomatoImage from "../assets/tomato.png";
import sunflowerImage from "../assets/sunflower.png";
import strawberryImage from "../assets/strawberry.png";
import pumpkinImage from "../assets/pumpkin.png";
import violetFlowerImage from "../assets/flower.png";

const seeds = [
  {
    id: "carrot",
    name: "Carrot Seed",
    image: carrotImage,
    growthTime: "1 hour 30 minutes",
    price: 10,
  },
  {
    id: "tomato",
    name: "Tomato Seed",
    image: tomatoImage,
    growthTime: "2 hours",
    price: 20,
  },
  {
    id: "sunflower",
    name: "Sunflower Seed",
    image: sunflowerImage,
    growthTime: "4 hours",
    price: 35,
  },
  {
    id: "strawberry",
    name: "Strawberry Seed",
    image: strawberryImage,
    growthTime: "3 hours",
    price: 30,
  },
  {
    id: "pumpkin",
    name: "Pumpkin Seed",
    image: pumpkinImage,
    growthTime: "6 hours",
    price: 50,
  },
  {
    id: "violet-flower",
    name: "Violet Flower Seed",
    image: violetFlowerImage,
    growthTime: "2 hours 30 minutes",
    price: 25,
  },
];

export default seeds;
