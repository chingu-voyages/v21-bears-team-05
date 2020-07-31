function StringMustNotBeEmpty(strName = "String") {
  this.strName = strName;
  return (str) => {
      if (str.trim() !== "") {
      return false;
    }
    return strName+" is required!";
  }
};

export { StringMustNotBeEmpty };
