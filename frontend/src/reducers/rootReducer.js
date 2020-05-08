import { combineReducers } from 'redux';

import initialized from './initializedReducer';
import user from './userReducer';
import kubernetesVersions from './kubernetesVersionsReducer';
import clusters from './clustersReducer';
import clusterComponents from './clusterComponentsReducer';

const rootReducer = combineReducers({
  initialized,
  user,
  kubernetesVersions,
  clusters,
  clusterComponents,
})

export default rootReducer;
