function persistStore(state, payload) {
  const stateObj = Object.assign({}, state, payload);
  return stateObj;
}

const reducer = (state = {}, { type, payload = null }) => {
  switch (type) {
    case "persist/REHYDRATE":
      return persistStore(state, payload);
    default:
      return state;
  }
};

export default reducer;
