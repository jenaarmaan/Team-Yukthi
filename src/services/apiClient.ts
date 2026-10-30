import { clientAuthService } from './firebaseAuth.ts';

const BASE_URL = '/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const token = await clientAuthService.getValidIdToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any,
    queryParams?: Record<string, any>,
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    let url = `${BASE_URL}${endpoint}`;
    if (queryParams) {
      const filtered = Object.entries(queryParams)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
      if (filtered) url += `?${filtered}`;
    }

    try {
      const headers = await this.getHeaders();
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      // Handle 401 Unauthorized by attempting session refresh and retrying once
      if (res.status === 401 && retryCount === 0) {
        await clientAuthService.getValidIdToken(true);
        return this.request<T>(method, endpoint, body, queryParams, retryCount + 1);
      }

      let json: any;
      try {
        json = await res.json();
      } catch {
        json = {
          success: res.ok,
          message: res.statusText,
          timestamp: new Date().toISOString()
        };
      }

      if (!res.ok && !json.error) {
        json.error = {
          code: `HTTP_${res.status}`,
          message: json.message || res.statusText || 'Request failed'
        };
      }

      return json as ApiResponse<T>;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Network connection error. Server may be temporarily unreachable.'
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  public async get<T>(endpoint: string, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, queryParams);
  }

  public async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body);
  }

  public async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body);
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient();
