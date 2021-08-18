const gitlabAPI = require("./gitlabAPI");

module.exports.getProjectIDs = function getProjectIDs(requestedGroupID, token) {
  const apiToken = token;
  const groupID = requestedGroupID;
  const getProjectSearchParams = new URLSearchParams("");
  getProjectSearchParams.append("order_by", "last_activity_at");

  console.log(`Getting jobs of group: ${groupID}`);

  return gitlabAPI
    .getProjectsByGroupID(apiToken, groupID, getProjectSearchParams)

    .then((projects) => {
      const ids = projects.map((project) => project.id);

      return ids;
    });
};

module.exports.getJobs = function getJobs(requestedGroupID, token, projectIDs) {
  const jobPromises = projectIDs.map((projectID) =>
    gitlabAPI.getJobsByProjectID(token, projectID)
  );
  return Promise.all(jobPromises).then((data) => {
    const flattenedJobArray = data.flat();
    const sortedData = flattenedJobArray.sort(
      (a, b) => a.created_at - b.created_at
    );
    let outputJobs = sortedData.filter((data) => {
      if (
        data.status === "running" ||
        data.status === "pending" ||
        data.status === "created"
      ) {
        return true;
      }
    });
    return outputJobs;
  });
};

module.exports.withCache = function withCache(callback, options) {
  //var cacheKey = JSON.stringify(args)
  var neededCache = options.cacheStorage.get(`${cacheKey}`);
  if (neededCache != null) {
    return new Promise((resolve, reject) => resolve(neededCache));
  }
  return (...args) => {
    return callback(...args).then((data) => {
      options.cacheStorage.set(`${cacheKey}`, data, options.ttl);
      return data;
    });
  };
};
