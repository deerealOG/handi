const Image = jest.fn(function MockImage(props) {
  // eslint-disable-next-line @next/next/no-img-element
  return props;
});

module.exports = Image;
module.exports.default = Image;
