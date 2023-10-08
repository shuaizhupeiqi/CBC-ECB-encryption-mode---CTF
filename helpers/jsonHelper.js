// iterate through a stringified JSON object and convert each objects' value back to a proper JSON obeject
export function parseJSONValues(input) {
  if (Array.isArray(input)) { //检查输入是否是数组
    return input.map((value) => parseJSONValues(value)); //如果是数组。对每个元素递归调用这个函数，并返回一个新数组
  } else if (typeof input === "object" && input !== null) { //检查输出是不是对象，null也算是对象
    const parsedObj = {}; //初始化一个新对象，用于存储解析后的数据
    for (const key in input) {  //遍历所有对象的键
      if (Object.prototype.hasOwnProperty.call(input, key)) { //利用Object.prototype.hasOwnProperty.call检查该键是不是对象自身的属性，而不是从原型链继承的
        parsedObj[key] = parseJSONValues(input[key]);//对每一个键递归调用parseJSONValues函数，保存在parsedObj
      }
    }
    return parsedObj;
  } else if (typeof input === "string") { //检查输入是否为一个字符串
    try {
      return JSON.parse(input); //用json.parse解析字符串
    } catch (error) {
      return input;
    }
  } else {
    return input;
  }
}

export function getAllValuesGivenKey(data, key) {
  //const values = Object.values(data).map((item) => item[key]);

  const values = Object.values(data)
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .map((item) => item[key]);

  return values;
}
