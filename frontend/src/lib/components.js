const componentStatuses = {
  PROVISIONED: 'Provisioned',
  PENDING: 'Pending',
  DELETING: 'Deleting'
}

export function provisionedComponents(components) {
  return components.filter(function(component) {
    return getCondition(component, "ReconcileSucceeded").status === "True"
  })
}

export function pendingComponents(components) {
  return components.filter(function(component) {
    return getCondition(component, "ReconcileSucceeded").status !== "True"
  })
}

export function getComponents(components, componentName) {
  for (const component of components) {
    if (component.metadata.name === componentName) {
      return component
    }
  }
  return null
}

export function componentStatus(component) {
  if (component.metadata.deletionTimestamp !== undefined) {
    return componentStatuses.DELETING
  }
  if (getCondition(component, "ReconcileSucceeded").status === "True") {
    return componentStatuses.PROVISIONED
  }
  return componentStatuses.PENDING
}

export function componentIcon(component) {
  const status = componentStatus(component);
  switch (status) {
  case componentStatuses.PENDING:
    return "fa-hourglass-half"
  case componentStatuses.PROVISIONED:
    return "fa-check-circle"
  case componentStatuses.DELETING:
    return "fa-trash"
  default:
    return "fa-question-circle"
  }
}

function getCondition(component, conditionType) {
  if (component.status.conditions === undefined) {
    return {
      type: conditionType,
      status: "Unknown"
    }
  }
  for (const condition of component.status.conditions) {
    if (condition.type === conditionType) {
      return condition
    }
  }
  return {
    type: conditionType,
    status: "Unknown"
  }
}
