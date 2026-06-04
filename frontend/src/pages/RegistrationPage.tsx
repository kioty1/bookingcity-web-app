import { RegistrationForm } from "../components/registrationForm";
import { Page } from "../enums/page.enums";

export const RegistrationPage = ({setPage}: {setPage: (page: Page) => void}) => {
    debugger;
  return <RegistrationForm setPage={setPage} />;
};