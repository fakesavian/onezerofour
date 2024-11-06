export const trackPerformance = (metricName, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Performance: ${metricName} took ${duration}ms`);

  return duration;
};

export const logUserInteraction = (action, metadata = {}) => {
  console.log('User Interaction:', {
    action,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
