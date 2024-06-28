/**
 * Generated by orval v6.30.2 🍺
 * Do not edit manually.
 * The Dash Backend
 * The Dash Backend API
 * OpenAPI spec version: 0.0.1
 */
import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  PostRefresh200,
  PostRefresh400,
  PostRefreshBody,
  PostSignIn200,
  PostSignIn400,
  PostSignInBody,
  PostSignUp200,
  PostSignUp400,
  PostSignUpBody,
} from "../../models";
import { useCustomInstance } from "../../../utils/axiosInstance";

/**
 * Refresh the access token with the refresh token
 */
export const usePostRefreshHook = () => {
  const postRefresh = useCustomInstance<PostRefresh200>();

  return useCallback(
    (postRefreshBody: PostRefreshBody) => {
      return postRefresh({
        url: `http://localhost:4000/refresh`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: postRefreshBody,
      });
    },
    [postRefresh],
  );
};

export const usePostRefreshMutationOptions = <
  TError = PostRefresh400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>,
    TError,
    { data: PostRefreshBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>,
  TError,
  { data: PostRefreshBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const postRefresh = usePostRefreshHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>,
    { data: PostRefreshBody }
  > = (props) => {
    const { data } = props ?? {};

    return postRefresh(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostRefreshMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>
>;
export type PostRefreshMutationBody = PostRefreshBody;
export type PostRefreshMutationError = PostRefresh400;

export const usePostRefresh = <
  TError = PostRefresh400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>,
    TError,
    { data: PostRefreshBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<ReturnType<typeof usePostRefreshHook>>>,
  TError,
  { data: PostRefreshBody },
  TContext
> => {
  const mutationOptions = usePostRefreshMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Sign up for toast
 */
export const usePostSignInHook = () => {
  const postSignIn = useCustomInstance<PostSignIn200>();

  return useCallback(
    (postSignInBody: PostSignInBody) => {
      return postSignIn({
        url: `http://localhost:4000/sign-in`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: postSignInBody,
      });
    },
    [postSignIn],
  );
};

export const usePostSignInMutationOptions = <
  TError = PostSignIn400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>,
    TError,
    { data: PostSignInBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>,
  TError,
  { data: PostSignInBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const postSignIn = usePostSignInHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>,
    { data: PostSignInBody }
  > = (props) => {
    const { data } = props ?? {};

    return postSignIn(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostSignInMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>
>;
export type PostSignInMutationBody = PostSignInBody;
export type PostSignInMutationError = PostSignIn400;

export const usePostSignIn = <
  TError = PostSignIn400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>,
    TError,
    { data: PostSignInBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<ReturnType<typeof usePostSignInHook>>>,
  TError,
  { data: PostSignInBody },
  TContext
> => {
  const mutationOptions = usePostSignInMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Sign up for toast
 */
export const usePostSignUpHook = () => {
  const postSignUp = useCustomInstance<PostSignUp200>();

  return useCallback(
    (postSignUpBody: PostSignUpBody) => {
      return postSignUp({
        url: `http://localhost:4000/sign-up`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: postSignUpBody,
      });
    },
    [postSignUp],
  );
};

export const usePostSignUpMutationOptions = <
  TError = PostSignUp400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>,
    TError,
    { data: PostSignUpBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>,
  TError,
  { data: PostSignUpBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const postSignUp = usePostSignUpHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>,
    { data: PostSignUpBody }
  > = (props) => {
    const { data } = props ?? {};

    return postSignUp(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostSignUpMutationResult = NonNullable<
  Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>
>;
export type PostSignUpMutationBody = PostSignUpBody;
export type PostSignUpMutationError = PostSignUp400;

export const usePostSignUp = <
  TError = PostSignUp400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>,
    TError,
    { data: PostSignUpBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<ReturnType<typeof usePostSignUpHook>>>,
  TError,
  { data: PostSignUpBody },
  TContext
> => {
  const mutationOptions = usePostSignUpMutationOptions(options);

  return useMutation(mutationOptions);
};
