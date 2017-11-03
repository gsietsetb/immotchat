import NavigationStore from "./NavigationStore";
import userStore from "./UserStore";
import roomStore from "./ChatRoomStore";
import messageStore from "./MessageStore";
import UploaderStore from "./UploaderStore";
import InvitationStore from "./InvitationStore";

export default {
  roomStore,
  messageStore,
  nav: new NavigationStore(),
  invitations: new InvitationStore(),
  uploader: new UploaderStore(),
  userStore
  // place for other stores...
};
