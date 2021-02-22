import React from "react";
import renderer from "react-test-renderer";
import Home from "./Home";
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

test("renders correctly", () => {
  const tree = renderer.create(<Home />);
  expect(tree).toMatchSnapshot();
});