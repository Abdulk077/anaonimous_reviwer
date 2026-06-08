import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 10,
  iterations: 300,
  duration: "30s",
};
export default function () {
  http.get("http://localhost:3000/api/posts/");
  sleep(1);
}
