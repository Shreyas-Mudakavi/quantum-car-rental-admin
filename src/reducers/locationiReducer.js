const locationReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        pickupLocations: action.pickupLocations,
        dropOffLocations: action.dropOffLocations,
        //   userCount: action.payload.userCount,
        //   filteredUserCount: action.payload.filteredUserCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export { locationReducer };
