import SpotifyStore from "./SpotifyStore";
import navigationStore from "./NavigationStore";
import userStore from "./UserStore";
import roomStore from "./ChatRoomStore";
import messageStore from "./MessageStore";

export default {
  roomStore,
  messageStore,
  searchStore: new SpotifyStore(),
  navigationStore,
  userStore
  // place for other stores...
};
