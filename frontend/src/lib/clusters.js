const clusterStatuses = {
  PROVISIONED: 'Provisioned',
  PENDING: 'Pending',
  DELETING: 'Deleting'
}

export function provisionedClusters(clusters) {
  return clusters.filter(
    (cluster) =>
      cluster.metadata.deletionTimestamp === undefined &&
      getCondition(cluster, "ReconcileSucceeded").status === "True"
  )
}

export function pendingClusters(clusters) {
  return clusters.filter(
    (cluster) =>
      cluster.metadata.deletionTimestamp === undefined &&
      getCondition(cluster, "ReconcileSucceeded").status !== "True"
  )
}

export function deletingClusters(clusters) {
  return clusters.filter((cluster) => cluster.metadata.deletionTimestamp !== undefined)
}

export function getCluster(clusters, clusterName) {
  for (const cluster of clusters) {
    if (cluster.metadata.name === clusterName) {
      return cluster
    }
  }
  return null
}

export function clusterStatus(cluster) {
  if (cluster.metadata.deletionTimestamp !== undefined) {
    return clusterStatuses.DELETING
  }
  if (getCondition(cluster, "ReconcileSucceeded").status === "True") {
    return clusterStatuses.PROVISIONED
  }
  return clusterStatuses.PENDING
}

export function clusterIcon(cluster) {
  const status = clusterStatus(cluster);
  switch (status) {
  case clusterStatuses.PENDING:
    return "fa-hourglass-half"
  case clusterStatuses.PROVISIONED:
    return "fa-check-circle"
  case clusterStatuses.DELETING:
    return "fa-trash"
  default:
    return "fa-question-circle"
  }
}

function getCondition(cluster, conditionType) {
  if (cluster.status.conditions === undefined) {
    return {
      type: conditionType,
      status: "Unknown"
    }
  }
  for (const condition of cluster.status.conditions) {
    if (condition.type === conditionType) {
      return condition
    }
  }
  return {
    type: conditionType,
    status: "Unknown"
  }
}
