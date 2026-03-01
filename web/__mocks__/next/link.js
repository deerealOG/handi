const Link = jest.fn(function MockLink({ children, href, ...rest }) {
  return { type: "a", props: { href, ...rest }, children };
});

module.exports = Link;
module.exports.default = Link;
