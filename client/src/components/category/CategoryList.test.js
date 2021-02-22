import React from "react";
import renderer from "react-test-renderer";
import CategoryList from "./CategoryList";

test("renders correctly", () => {
  const tree = renderer.create(<CategoryList />).toJSON();
  expect(tree).toMatchSnapshot();
}); 