import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const signup = body => {
  console.log('signup_body:-', body);
  return {
    url: Endpoints.signup,
    method: apiMethods.post,
    body,
  };
};

const verifyOtp = body => {
  console.log('verifyOtp_body:-', body);
  return {
    url: Endpoints.verifyOtp,
    method: apiMethods.post,
    body,
  };
};
const forgotPassword = body => {
  console.log('forgotPassword_body:-', body);
  return {
    url: Endpoints.forgotPassword,
    method: apiMethods.post,
    body,
  };
};
const forgotOTP = body => {
  console.log('forgotOTP_body:-', body);
  return {
    url: Endpoints.forgotOTP,
    method: apiMethods.post,
    body,
  };
};
const resetPassword = body => {
  console.log('resetPassword_body:-', body);
  return {
    url: Endpoints.resetPassword,
    method: apiMethods.post,
    body,
  };
};
const login = body => {
  console.log('login_body:-', body);
  return {
    url: Endpoints.login,
    method: apiMethods.post,
    body,
  };
};

const vendorBusinessProfile = body => {
  console.log('vendorBusinessProfile_body:-', body);
  return {
    url: Endpoints.vendorBusinessProfile,
    method: apiMethods.post,
    body,
  };
};

const vendorUpdateProfile = body => {
  console.log('vendorUpdateProfile_body:-', body);
  return {
    url: Endpoints.vendorUpdateProfile,
    method: apiMethods.post,
    body,
  };
};

const tailorBusinessProfile = body => {
  console.log('tailorBusinessProfile_body:-', body);
  return {
    url: Endpoints.tailorBusinessProfile,
    method: apiMethods.post,
    body,
  };
};

const tailorEditProfile = body => {
  console.log('tailorEditProfile_body:-', body);
  return {
    url: Endpoints.tailorEditProfile,
    method: apiMethods.post,
    body,
  };
};

export const AuthService = baseApi.injectEndpoints({
  endpoints: build => ({
    signup: build.mutation({ query: signup }),
    verifyOtp: build.mutation({ query: verifyOtp }),
    login: build.mutation({ query: login }),
    forgotPassword: build.mutation({ query: forgotPassword }),
    forgotOTP: build.mutation({ query: forgotOTP }),
    resetPassword: build.mutation({ query: resetPassword }),
    vendorBusinessProfile: build.mutation({
      query: vendorBusinessProfile,
    }),
    vendorUpdateProfile: build.mutation({
      query: vendorUpdateProfile,
    }),
    tailorBusinessProfile: build.mutation({
      query: tailorBusinessProfile,
    }),
    tailorEditProfile: build.mutation({
      query: tailorEditProfile,
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useForgotOTPMutation,
  useResetPasswordMutation,
  useVendorBusinessProfileMutation,
  useVendorUpdateProfileMutation,
  useTailorBusinessProfileMutation,
  useTailorEditProfileMutation,
} = AuthService;
