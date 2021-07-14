import { createApi } from '@reduxjs/toolkit/query/react';
import workboundApi from './workboundApi'

const axiosBaseQuery = () => async ({ url, method, data}) => {
  try {
    const result = await workboundApi({
      url: url,
      method: method,
      data: data,
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
    tagTypes: ['Tasks'],
    endpoints: (builder) => {
        return {
            fetchTasks: builder.query({
                query(args) {
                    const { page, pageSize, titleSearch } = args;
                    let url = `task/?page=${page}&size=${pageSize}`
                    url = titleSearch ? url = url + `&search=${titleSearch}`: url
                    return ({
                      url: url,
                      method: 'GET'
                    })
                },
                providesTags: (result) => 
                    result
                    ?
                    [
                      ...result.results.map(({ id }) => ({ type: 'Tasks', id })),
                      { type: 'Tasks', id: 'LIST'}
                    ]
                    :
                    [{ type: 'Tasks', id: 'LIST' }],
                }),
            deleteTask: builder.mutation({
              query(args) {
                  const { taskId } = args;
                  return ({
                    url: `task/${taskId}/`,
                    method: 'DELETE'
                  })
              },
              invalidatesTags: (result, error, { taskId }) => [{ type: 'Tasks', id: taskId}]
            }),
            addTask: builder.mutation({
              query(data) {
                  return ({
                    url: `task/`,
                    method: 'POST',
                    data
                  })
              },
              invalidatesTags: [{ type: 'Tasks', id: 'LIST' }]
            })
        };
    }, 
});

export const { useFetchTasksQuery,
               useDeleteTaskMutation,
               useAddTaskMutation,
               } = apiSlice;
