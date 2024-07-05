import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Axios, { AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({ baseURL: "" });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const useCustomInstance = <T>(): ((
  config: AxiosRequestConfig
) => Promise<T>) => {
  return (config: AxiosRequestConfig) => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
      ...config,
      cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
      source.cancel("Query was cancelled by React Query");
    };

    return promise;
  };
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const accessToken = getCookie("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = getCookie("refresh_token");
      if (!refreshToken) {
        window.location.href = `${defaultUrl}/login`;
        return;
      }

      try {
        const tokens = await axios.post(
          `${serverUrl}/refresh`,
          {
            refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );

        if (tokens.status === 200) {
          const { access_token, refresh_token } = tokens.data;
          setCookie("access_token", access_token);
          setCookie("refresh_token", refresh_token);
          return axios(error.config);
        }
      } catch {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = `${defaultUrl}/login`;
        return;
      }
    }
  }
);

export default useCustomInstance;
