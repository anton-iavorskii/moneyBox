// для лучшей читаемости разделяем число
// на триады (добаляем пробелы после 1 и 3 цифры)

const addSpaceInNumbers = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
};

export default addSpaceInNumbers;
