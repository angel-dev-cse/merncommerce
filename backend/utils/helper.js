// make input object query into case insensitive (leaving the number out)
const caseIRegex = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      caseIRegex(obj[key]);
    } else if (isNaN(obj[key])) {
      obj[key] = { $regex: new RegExp(obj[key], "i") };
    }
  }

  return obj;
};

module.exports = { caseIRegex };
