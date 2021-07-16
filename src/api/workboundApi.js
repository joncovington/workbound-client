import axios from 'axios';
import { push } from 'connected-react-router';
import store from '../app/store'
import { signOut } from '../features/auth/authSlice';
import { clearProfile } from '../features/user/userSlice';

const baseURL = 'http://localhost:8000/api/v1/'

const apiConnection = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
    }
});

apiConnection.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config)
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

apiConnection.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			store.dispatch(push('/'))
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'user/token/refresh/'
		) {
			store.dispatch(clearProfile())
        	store.dispatch(signOut(localStorage.getItem('refresh_token')))
			store.dispatch(push('/'))
			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken !== undefined || refreshToken !== null) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// refresh expiry date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log('Token expiry: ' + tokenParts.exp);

				if (tokenParts.exp > now) {
					return apiConnection
						.post('user/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							localStorage.setItem('refresh_token', response.data.refresh);

							apiConnection.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;

							return apiConnection(originalRequest);
						})
						.catch((err) => {
							console.log(err);
							store.dispatch(clearProfile())
        					store.dispatch(signOut(localStorage.getItem('refresh_token')))
							store.dispatch(push('/'))
						});
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					store.dispatch(clearProfile())
        			store.dispatch(signOut(localStorage.getItem('refresh_token')))
					store.dispatch(push('/'))
				}
			} else {
				console.log('Refresh token not available.')
				store.dispatch(clearProfile())
				store.dispatch(push('/'))
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default apiConnection;