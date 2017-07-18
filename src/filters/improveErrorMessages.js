
/**
 * This filter replases server error messages with more descriptive and user-friendly formulations
 *
 * @module app
 * @submodule improveErrorMessages
 */
app.filter('improveErrorMessages', () => ((data) => {
  const TIMESTAMP_MESSAGE = 'Invalid transaction timestamp. Timestamp is in the future';
  if (!data.success && data.message === TIMESTAMP_MESSAGE) {
    data.message = 'Invalid transaction timestamp. Time on your computer is ahead of time. Please set up your OS time correctly.';
  }
  return data;
}));

