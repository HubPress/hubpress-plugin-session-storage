export function sessionStoragePlugin(hubpress) {

  // store credentials in localstorage
  hubpress.on('receiveAuthentication', opts => {
    if (opts.data.authentication.isAuthenticated) {
      sessionStorage.setItem(`${opts.state.application.config.meta.repositoryName}-authentication`, JSON.stringify({
        credentials: {
          token: opts.data.authentication.token,
          permissions: opts.data.authentication.permissions
        },
        userInformations: opts.data.authentication.userInformations
      }));
    }

    return opts;
  });

  hubpress.on('requestSavedAuth', opts => {
    console.log('SessionStorage plugin requestSavedAuth', opts);
    let authentication;
    const storedData = sessionStorage.getItem(`${opts.data.config.meta.repositoryName}-authentication`);

    if (storedData) {
      authentication = JSON.parse(storedData);
      authentication.isAuthenticated = true;
    }
    else {
     authentication = {
       credentials: {},
       userInformations: {},
       isAuthenticated: false
     };
    }

    const mergeAuthentication = Object.assign({}, authentication, opts.data.authentication);
    const data = Object.assign({}, opts.data, {authentication: mergeAuthentication});
    return Object.assign({}, opts, {data});
  })

  hubpress.on('requestLogout', opts => {
    sessionStorage.removeItem(`${opts.state.application.config.meta.repositoryName}-authentication`);
    return opts;
  })

}
