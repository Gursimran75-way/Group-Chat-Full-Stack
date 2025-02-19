import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { resetTokens, setTokens, setUser } from "../store/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { ApiResponse, Group, Message, RefreshTokenResponse, User } from "../types";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Access the state from Redux
      const token = (getState() as RootState).auth.accessToken;

      if (token) {
        headers.set("Authorization", `bearer ${token}`);
      }

      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.data == "Unauthorized") {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as RefreshTokenResponse
        ).data;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        api.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(resetTokens());
        api.dispatch(setUser({ user: null }));
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // window.location.assign("/auth");
        const navigate = useNavigate();
        navigate("/auth");
      }
    } else {
      api.dispatch(resetTokens());
      api.dispatch(setUser({ user: null }));
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // window.location.assign("/auth");
      const navigate = useNavigate();
        navigate("/auth");
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/users/me`,
    }),
    getUserGroups: builder.query<ApiResponse<User>, void>({
      query: () => `/users/get-user-groups`,
    }),
    getGroupAnalytics: builder.query<ApiResponse<any>, { id: string }>({
      query: ({ id }) => `/group/group-analytics/${id}`,
    }),
    getPublicGroups: builder.query<ApiResponse<Group[]>,void>({
      query: () => `/group/public`,
    }),
    getAllUserThatNotBelongToGroup: builder.query<ApiResponse<User[]>,{id: string}>({
      query: ({id}) => `/users/getAllUser/${id}`,
    }),
    getAnalytics: builder.query<ApiResponse<any>,void>({
      query: () => `/group/analytics`,
    }),

    // *----------------------------Mutations ----------------------------*
    
    login: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => {
        return { url: `/users/login`, method: "POST", body };
      },
    }),
    register: builder.mutation<
      ApiResponse<User>,
      {name:string, email:string, password:string}
    >({
      query: (body) => {
        return { url: `/users/`, method: "POST", body };
      },
    }),
    updateUser: builder.mutation<ApiResponse<User>, {name: string, email: string, password: string, _id: string}>({
      query: (body) => {
        return { url: `/users/${body._id}`, method: "PUT", body };
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return { url: `/users/logout`, method: "POST" };
      },
    }),
    uploadImage: builder.mutation<ApiResponse<User>, FormData>({
      query: (formData) => ({
        url: `/users/upload-image`,
        method: "POST",
        body: formData,
      }),
    }),
    getGroupMsgs: builder.mutation<ApiResponse<Message[]>, {groupId: string}>({
      query: (body) => ({
        url: `/message/get-all`,
        method: "POST",
        body: body,
      }),
    }),
    sendMsg: builder.mutation<ApiResponse<Message>, {groupId: string, content: string}>({
      query: (body) => ({
        url: `/message/send`,
        method: "POST",
        body: body,
      }),
    }),
    createGroup: builder.mutation<ApiResponse<Group>, {name: string, type: string}>({
      query: (body) => ({
        url: `/group/`,
        method: "POST",
        body: body,
      }),
    }),
    joinPublicGroup: builder.mutation<ApiResponse<any>, {id: string}>({
      query: ({id}) => ({
        url: `group/${id}/join`,
        method: "POST",
      }),
    }),
    getInvitation: builder.mutation<ApiResponse<any>, {userId: string, groupId: string}>({
      query: (data) => ({
        url: `group/${data.groupId}/invite/${data.userId}`,
        method: "POST",
      }),
    }),
    acceptInvitation: builder.mutation<ApiResponse<any>, {email: string, password: string, token: string}>({
      query: (data) => ({
        url: `group/accept-invitation/${data.token}`,
        method: "POST",
        body: data,
      }),
    }),
    
  }),
});

export const {
  useMeQuery,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUploadImageMutation,
  useGetUserGroupsQuery,
  useGetGroupMsgsMutation,
  useSendMsgMutation,
  useGetGroupAnalyticsQuery,
  useCreateGroupMutation,
  useGetPublicGroupsQuery,
  useJoinPublicGroupMutation,
  useGetAllUserThatNotBelongToGroupQuery,
  useGetInvitationMutation,
  useAcceptInvitationMutation,
  useGetAnalyticsQuery
} = api;
