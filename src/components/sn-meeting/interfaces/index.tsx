interface UserI {
  id: string;
  avatar: string;
  name: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isSpeaker: boolean;
}


interface ListUserI {
  users: UserI[];
}
