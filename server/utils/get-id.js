const jwt = require('jsonwebtoken')

const getId = async (authorization) => {
  if (!authorization) return;
  const token = authorization.split(' ')[1]
  const decodeIdData = jwt.verify(token, process.env.SECRET_JWT)
  return decodeIdData.id
}

module.exports = getId