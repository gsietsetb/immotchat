import SpotifyStore from "./SpotifyStore";
import NavigationStore from "./NavigationStore";
import userStore from "./UserStore";
import roomStore from "./ChatRoomStore";
import messageStore from "./MessageStore";

export default {
  roomStore,
  messageStore,
  nav: new NavigationStore(),
  userStore
  // place for other stores...
};
