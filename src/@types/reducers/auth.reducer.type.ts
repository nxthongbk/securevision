export default interface IAuthReducer {
  // State authenticated
  isAuthenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;

  // Userinfo
  userInfo: any | null;
  setUserInfo: React.Dispatch<React.SetStateAction<any | null>>;
}