const { createMapper } = require("@automapper/core");
const { classes } = require("@automapper/classes");

const mapper = createMapper({
  strategyInitializer: classes(),
});

module.exports = mapper;
