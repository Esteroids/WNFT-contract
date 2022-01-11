function copyAfterDeploy() {
  const fs = require("fs")

  if (process.env.COPY_AFTER_DEPLOY_FROM) {
    const sourceFile = process.env.COPY_AFTER_DEPLOY_FROM
    const destFile = process.env.COPY_AFTER_DEPLOY_TO
    if (fs.copyFileSync(sourceFile, destFile)) {
      console.log(sourceFile, " was copied to ", destFile)
    }
  }
}

exports.copyAfterDeploy = copyAfterDeploy
