import { DashboardState } from "./DashboardProvider";

type DashboardActionType = { type: "[Dashboard] - Init" };

export const dashboardReducer = (
  state: DashboardState,
  action: DashboardActionType,
): DashboardState => {
  switch (action.type) {
    case "[Dashboard] - Init":
      return {
        ...state,
      };
    default:
      return state;
  }
};
