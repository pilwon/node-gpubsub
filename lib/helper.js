function getStringAfterLastSlash(str) {
  var split = str.split('/');
  return split[split.length - 1];
}

function skipAlreadyExistsError(err) {
  if (!err.errors.length || err.errors[0].reason !== 'alreadyExists') {
    throw err;
  }
}

exports.getStringAfterLastSlash = getStringAfterLastSlash;
exports.skipAlreadyExistsError = skipAlreadyExistsError;
