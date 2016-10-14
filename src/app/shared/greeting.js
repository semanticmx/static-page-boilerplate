class Greeting {
  constructor(greet) {
    this.greet = greet;
  }

  say() {
    return `${this.greet}!`;
  }
}

export default Greeting;
