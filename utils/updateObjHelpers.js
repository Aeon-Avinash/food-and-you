const R = require("ramda");

exports.updateObjProp = (oldObject, updateVal, ...updateKeyPath) => {
  try {
    if ((!updateKeyPath || !oldObject) && updateVal) {
      return { ...updateVal };
    }
    const lensPath = R.lensPath(updateKeyPath);
    const updatedObj = R.set(lensPath, updateVal, oldObject);
    // console.log({ updatedObj });
    return updatedObj;
  } catch (err) {
    console.log("Error updating the Object property. Check the arguments!");
    return oldObject;
  }
};

exports.updateObjAddToArr = (oldObject, updateVal, ...updateArrPath) => {
  try {
    const lensPath = R.lensPath(updateArrPath);
    const oldArr = R.view(lensPath, oldObject);
    const newArr = R.append(updateVal, oldArr);
    const updatedObj = R.set(lensPath, newArr, oldObject);
    return updatedObj;
  } catch (err) {
    console.log("Error updating the nested Array. Check the arguments!");
    return oldObject;
  }
};

exports.updateArrInObjAddOrReplaceByAccessor = (
  oldObject,
  updateVal,
  accessor,
  ...updateArrPath
) => {
  try {
    const lensPath = R.lensPath(updateArrPath);
    const oldArr = R.view(lensPath, oldObject);
    let ifExists, newArr;
    if (typeof updateVal[accessor] === "object" && accessor === "_id") {
      ifExists = oldArr.find(elem => {
        return elem[accessor].equals(updateVal[accessor]);
      });

      newArr = !ifExists
        ? R.append(updateVal, oldArr)
        : oldArr.map(elem =>
            elem[accessor].equals(updateVal[accessor]) ? updateVal : elem
          );
    } else {
      ifExists = oldArr.find(elem => {
        return elem[accessor] === updateVal[accessor];
      });

      newArr = !ifExists
        ? R.append(updateVal, oldArr)
        : oldArr.map(elem =>
            updateVal[accessor] === elem[accessor] ? updateVal : elem
          );
    }

    return R.set(lensPath, newArr, oldObject);
  } catch (err) {
    console.log("Error updating the nested Array. Check the arguments!");
    return oldObject;
  }
};

exports.updateObjRemoveFromArrByAccessor = (
  oldObject,
  removeItem,
  accessor,
  ...updateArrPath
) => {
  try {
    const lensPath = R.lensPath(updateArrPath);
    const oldArr = R.view(lensPath, oldObject);
    return R.set(
      lensPath,
      oldArr.filter(elem => {
        if (typeof elem[accessor] === "object" && accessor === "_id") {
          return !elem[accessor].equals(removeItem[accessor]);
        } else {
          return removeItem[accessor] !== elem[accessor];
        }
      }),
      oldObject
    );
  } catch (err) {
    console.log("Error updating the nested Array. Check the arguments!");
    return oldObject;
  }
};

exports.getNestedObjValue = (object, ...readKeyPath) => {
  try {
    const lensPath = R.lensPath(readKeyPath);
    return R.view(lensPath, object);
  } catch (err) {
    console.log("Error reading the Object property. Check the arguments!");
    return undefined;
  }
};
