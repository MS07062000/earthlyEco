import UserInfo from "./userInfo";

export default interface AuthState {
  user: UserInfo | null;
  errorMessage: string | null;
  loading: boolean;
  successMessage: string| null;
  sessionError: boolean;
}
