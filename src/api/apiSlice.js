import { createApi } from '@reduxjs/toolkit/query/react';
import workboundApi from './workboundApi'

const axiosBaseQuery = () => async ({ url, method, data}) => {
  try {
    const result = await workboundApi({
      url: url,
      method: method,
      data: data
    })
    return { data: result.data }
  }
  catch (axiosError) {
    let err = axiosError
    return {
      error: { status: err.response?.status, data: err.response?.data },
    }
  }
}


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => {
        return {
            fetchTasks: builder.query({
                query(limit = 10) {
                    return ({
                      url: `/task/?limit=${limit}`,
                      method: 'GET'
                    })
                },
            }),
        };
    }, 
});

export const { useFetchTasksQuery } = apiSlice;
