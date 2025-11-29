"use client";

import { deleteCookie } from "cookies-next";
import { getSession, signOut } from "next-auth/react";

import { useGlobalStore } from "../store/globalStore";
import { EHttpStatusCode } from "../types/enum";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5300";

const autoLogout = async () => {
  deleteCookie("fcmToken", { path: "/" });
  localStorage.clear();
  await signOut();
};

const handleResponse = async (res: Response) => {
  try {
    const contentType = res.headers.get("content-type");

    if (res.status === EHttpStatusCode.UNAUTHORIZED) {
      await autoLogout();
    }

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    const text = await res.text();
    throw new Error(text);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
};

const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession();
  return (session as any)?.accessToken ?? null;
};

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ─────────────────────────────
// HTTP METHODS
// ─────────────────────────────

export const apiGet = async (path: string, query?: string) => {
  try {
    useGlobalStore.getState().setLoading(true);

    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}${path}${query ? `?${query}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-cache",
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("GET error:", error);
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiGetNoLoading = async (path: string, query?: string) => {
  try {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}${path}${query ? `?${query}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-cache",
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("GET (no loading) error:", error);
  }
};

export const apiPost = async (path: string, payload: any, loading = true) => {
  try {
    if (loading) useGlobalStore.getState().setLoading(true);

    const token = await getAuthToken();
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const body =
      payload instanceof FormData ? payload : JSON.stringify(payload);

    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body,
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("POST error:", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    if (loading) useGlobalStore.getState().setLoading(false);
  }
};

export const apiPut = async (path: string, payload?: any) => {
  try {
    useGlobalStore.getState().setLoading(true);

    const token = await getAuthToken();
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    const body =
      payload instanceof FormData ? payload : JSON.stringify(payload);

    if (!(payload instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body,
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("PUT error:", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiPatch = async (path: string, payload?: any) => {
  try {
    useGlobalStore.getState().setLoading(true);

    const token = await getAuthToken();
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };

    let body: BodyInit | null = null;

    if (payload) {
      body = payload instanceof FormData ? payload : JSON.stringify(payload);

      if (!(payload instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers,
      body,
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("PATCH error:", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiDelete = async (path: string) => {
  try {
    useGlobalStore.getState().setLoading(true);

    const headers = await getAuthHeaders();

    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers,
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("DELETE error:", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};
