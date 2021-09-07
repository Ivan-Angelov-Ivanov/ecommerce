import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "../../reducers/index";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const renderWithRedux = (component, store = createStore(rootReducer)) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

test("check if searchbox is empty", () => {
  renderWithRedux(<Header />);
  expect(screen.getByRole("searchbox", { name: "" })).toBeEmptyDOMElement();
});
