const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  pathname: "/",
  query: {},
}));

const usePathname = jest.fn(() => "/");
const useSearchParams = jest.fn(() => new URLSearchParams());
const useParams = jest.fn(() => ({}));

module.exports = {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
};
