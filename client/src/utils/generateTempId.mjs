function* counter() {
    let count = 0;
    while (true) {
        yield count++;
    }
}

const count = counter()

const generateTempId = () => Date.now().toString()+count.next().value

export default generateTempId