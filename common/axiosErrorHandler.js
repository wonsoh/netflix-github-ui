export default function handleAxiosError(error, req, res) {
  if (error.response) {
    const { response } = error;
    const { status } = response;
    res.status(status);
    res.send(response.data);
  } else {
    // some internal server error occured
    res.status(500);
    res.send(error.message);
  }
}
