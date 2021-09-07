import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { userReducer } from "../../reducers/userReducer";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const renderWithRedux = (
  component,
  { initialState = null, store = createStore(userReducer, initialState) } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    ),
    store,
  };
};

test("if user enters data, the button is enabled", () => {
  renderWithRedux(<Login />);

  expect(
    screen.getByRole("button", { name: /mail Login with Email\/Password/i })
  ).toBeDisabled();

  userEvent.type(
    screen.getByPlaceholderText(/email/i),
    "summerenergy1@hotmail.com"
  );
  userEvent.type(screen.getByPlaceholderText(/password/i), "654312");

  expect(
    screen.getByRole("button", { name: /mail Login with Email\/Password/i })
  ).toBeEnabled();
});
