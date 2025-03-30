
module.exports = function mapModelToModel(targetInstance, sourceInstance) {
      let targetKeys = Object.keys(targetInstance.schema.paths);
      let sourceKeys = Object.keys(sourceInstance.toObject());
    
      targetKeys.forEach((key) => {
        if (sourceKeys.includes(key) && sourceInstance[key] !== undefined) {
          targetInstance[key] = sourceInstance[key];
        }
      });
    
      return targetInstance;
}
