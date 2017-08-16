import { AsyncStorage } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import { persist, create } from "mobx-persist";

import gql from "graphql-tag";

import { graphcool } from "../Lib/graphcool";

const queries = {
  login: gql`
    mutation($email: String!, $password: String!) {
      signinUser(email: { email: $email, password: $password }) {
        token
      }
    }
  `,
  register: gql`
    mutation($email: String!, $password: String!) {
      createUser(
        authProvider: { email: { email: $email, password: $password } }
      ) {
        id
      }
      signinUser(email: { email: $email, password: $password }) {
        token
      }
    }
  `,
  getCurrent: gql`
    query {
      user {
        id
        email
        firstName
        lastName
        displayName
        profilePicture
      }
    }
  `,
  update: gql`
    mutation($id: ID!, $profilePicture: String, $displayName: String) {
      updateUser(
        id: $id
        profilePicture: $profilePicture
        displayName: $displayName
      ) {
        id
        email
        firstName
        lastName
        displayName
        profilePicture
      }
    }
  `
};
class UserStore {
  @observable errorMessage = null;

  @observable hydrated = false;
  @observable fetching = false;

  @persist("object")
  @observable
  info = null;

  @persist("object")
  @observable
  user = null;

  @computed
  get currentUser() {
    return this.user;
  }

  @action
  fetchCurrentUser() {
    this.fetching = true;
    this.errorMessage = null;

    return graphcool
      .query({
        query: queries.getCurrent
      })
      .then(result => {
        this.fetching = false;
        console.log("fetchCurrentUser result", result);
        const { data } = result;

        this.user = Object.assign({}, this.user, data.user);
        return this.user;
      })
      .catch(err => {
        this.fetching = false;
        this.info = null;
        this.errorMessage = err.message;
        console.log("error", err);
      });
  }

  @action
  hydrateComplete() {
    this.hydrated = true;

    console.log("hydrateComplete");
  }

  @action
  login(email, password) {
    console.log("email", email);
    console.log("password", password);
    this.errorMessage = null;
    this.fetching = true;

    graphcool
      .mutate({
        mutation: queries.login,
        variables: {
          email,
          password
        }
      })
      .then(result => {
        console.log("result", result);
        const { data } = result;
        if (data.signinUser) {
          this.fetching = true;
          this.user = Object.assign({}, this.user, {
            token: data.signinUser.token
          });

          const currentUser = this.fetchCurrentUser()
            .then(r => r)
            .catch(error => console.log("error", error));

          this.updateProfile().catch(error => console.log("error", error));
          return currentUser;
        }
      })
      .catch(err => {
        console.log("err", err.message);
        this.fetching = false;
        this.user = null;
        this.errorMessage = err.message;
      });
  }

  @action
  createUser(email, password, profile) {
    this.fetching = true;
    this.errorMessage = null;

    console.log("profile", profile);
    graphcool
      .mutate({
        mutation: queries.register,
        variables: {
          email,
          password
        }
      })
      .then(result => {
        const { data } = result;
        this.fetching = false;
        this.user = Object.assign(
          {},
          {
            token: data.signinUser.token
          }
        );
        const currentUser = this.fetchCurrentUser()
          .then(r => r)
          .catch(error => console.log("error", error));
        this.updateProfile(profile).catch(error => console.log("error", error));
        return currentUser;
      })
      .catch(err => {
        console.log("err", err.message);
        this.fetching = false;
        this.info = null;
        this.errorMessage = err.message;
      });
  }

  @action
  async updateProfile(profile) {
    this.fetching = true;
    let user;
    try {
      user = await this.fetchCurrentUser();
    } catch (err) {
      console.log(err);
    }

    return graphcool
      .mutate({
        mutation: queries.update,
        variables: {
          id: user.id,
          profilePicture:
            (profile || {}).profilePicture ||
            `https://api.adorable.io/avatars/150/${user.id}`,
          displayName:
            (profile || {}).displayName ||
            user.displayName ||
            (user.firstName &&
              user.lastName &&
              `${user.firstName} ${user.lastName}`) ||
            user.email
        }
      })
      .then(result => {
        const resultUser = result.data.user;
        this.user = Object.assign(this.user || {}, resultUser);
        return this.user;
      })
      .catch(error => console.log("error", error));
  }

  @action
  logout() {
    this.fetching = true;
    this.user = null;
    this.fetching = false;
  }
}

export default (userStore = new UserStore());

const hydrate = create({ storage: AsyncStorage, jsonify: true });
hydrate("user", userStore).then(() => {
  userStore.hydrateComplete();
});
