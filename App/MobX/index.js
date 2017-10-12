import NavigationStore from "./NavigationStore";
import userStore from "./UserStore";
import roomStore from "./ChatRoomStore";
import messageStore from "./MessageStore";
import InvitationStore from "./InvitationStore";

export default {
  roomStore,
  messageStore,
  nav: new NavigationStore(),
  invitations: new InvitationStore(),
  userStore
  // place for other stores...
};
